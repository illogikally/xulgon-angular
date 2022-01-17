import {Location} from '@angular/common';
import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {ReplaySubject, Subject} from 'rxjs';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MessageService} from '../../common/message.service';
import {Post} from '../../post/post';
import {PostService} from '../../post/post.service';
import {ProfileService} from '../profile.service';
import {UserProfile} from '../user-profile';

@Component({
  selector: 'app-profile-timeline',
  templateUrl: './profile-timeline.component.html',
  styleUrls: ['./profile-timeline.component.scss']
})
export class ProfileTimelineComponent implements OnInit, OnDestroy {

  @Input() userProfile!: UserProfile;
  timeline: Post[] = new Array<Post>();

  loggedInUserId: number;
  pageId: number;
  isLoadingPosts = false;
  initialHide = true;
  isLoadedAll = false;

  private destroyed$ = new ReplaySubject<boolean>(1);

  constructor(
    private title: Title,
    private message$: MessageService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private post$: PostService,
    private profile$: ProfileService,
    private auth: AuthenticationService
    ) {
      this.loggedInUserId = this.auth.getUserId();
      this.pageId = Number(this.activatedRoute.parent?.snapshot.paramMap.get('id'));
  }

  ngOnDestroy() {
    // this.destroyed$.next(true);
    // this.destroyed$.complete()

  }

  ngOnInit(): void {
    this.initialHide = false;
    // setTimeout(() => {
    //   this.initialHide = false;
    // }, 500);

    if (this.pageId !== NaN) {
      this.getPosts();
      this.profile$.getUserProfile(this.pageId)
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

  getPosts(): void {
    this.isLoadingPosts = true;
    const size = this.timeline.length ? 5 : 2;
    const offset = this.timeline.length;
    if (this.pageId !== NaN) {
      this.post$
        .getPostsByPageId(this.pageId, size, offset)
        .subscribe(posts => {
          this.timeline = this.timeline.concat(posts);
          this.isLoadingPosts = false;
          if (!posts.length) {
            this.isLoadedAll = true;
          }
        });
    }
  }

  @HostListener('window:scroll', [])
  loadOnScroll(): void {
    if (
      window.scrollY >= document.body.scrollHeight - 1.2*window.innerHeight
      && !this.isLoadingPosts
      && !this.isLoadedAll
      && /\/\d+/.test(this.router.url)
      ) {
        this.getPosts();
    }

  }



  updateSticky = new Subject<boolean>();

  updateMethod() {
    this.updateSticky.next(true);
  }

}
