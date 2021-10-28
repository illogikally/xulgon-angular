import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, first, take, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../../authentication/authentication.service';
import { MessageService } from '../../common/message.service';
import { Post } from '../../post/post';
import { PostService } from '../../post/post.service';
import { ProfileService } from '../profile.service';
import { UserProfile } from '../user-profile';

@Component({
  selector: 'app-profile-timeline',
  templateUrl: './profile-timeline.component.html',
  styleUrls: ['./profile-timeline.component.scss']
})
export class ProfileTimelineComponent implements OnInit, OnDestroy {

  @Input() userProfile: UserProfile | undefined;
  @Input() timeline: Post[] | undefined;
  loggedInUserId: number;

  private destroyed$ = new ReplaySubject<boolean>(1);

  constructor(private message$: MessageService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private post$: PostService,
    private profile$: ProfileService,
    private auth: AuthenticationService) {

      this.loggedInUserId = this.auth.getUserId();
    }

  ngOnDestroy() {
    // this.destroyed$.next(true);
    // this.destroyed$.complete()
    
  }
  ngOnInit(): void {

    let id = Number(this.activatedRoute.parent?.snapshot.paramMap.get('id'));
    if (id !== NaN) {
      this.post$.getPostsByPageId(id)
      .subscribe(posts => {
        this.timeline = posts;
      });
      this.profile$.getUserProfile(id)
      .subscribe(profile => {
        this.userProfile = profile;
      })
    }
    
    // this.message$.onProfileLoaded()
    // .pipe(
    //   // takeUntil(this.destroyed$),
    //   filter(p => !!Object.keys(p).length),
    //   take(1))
    // .subscribe(profile => {
    //   console.log(profile);
      
    //   this.userProfile = profile;
    //   this.post$.getPostsByPageId(profile.id).subscribe(timeline => {
    //     this.timeline = timeline;
    //   });
    //   this.message$.sendLoadedProfile({} as UserProfile);
    // });
  }

  updateSticky = new Subject<boolean>();

  updateMethod() {
    this.updateSticky.next(true);
  }

}
