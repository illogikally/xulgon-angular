import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../../authentication/authentication.service';
import { MessageService } from '../../common/message.service';
import { Post } from '../../post/post';
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

  constructor(private messageService: MessageService,
    private auth: AuthenticationService) {

      this.loggedInUserId = this.auth.getUserId();
    }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete()
    
  }
  ngOnInit(): void {
    
    // this.messageService.onProfileLoaded()
    // .pipe(takeUntil(this.destroyed$))
    // .subscribe(profile => {
    //   this.userProfile = profile;
    // })
  }

  updateSticky = new Subject<boolean>();

  updateMethod() {
    this.updateSticky.next(true);
  }

}
