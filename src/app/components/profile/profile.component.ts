import { Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { UserProfile } from './user-profile';
import { MessageService } from '../common/message.service';
import { UserService } from '../common/user.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { catchError, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Post } from '../post/post';
import { PostService } from '../post/post.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  @Input() profileId!: number;

  @ViewChild('sidebar', {static: true}) sidebar!: ElementRef;
  @ViewChild('replyFriendRequest') replyRequestBtn!: ElementRef;
  @ViewChild('friend') friendBtn!: ElementRef;

  profileLoaded: EventEmitter<UserProfile> = new EventEmitter();

  private destroyed$ = new ReplaySubject<boolean>(1);
  isUpdateAvatar = false;
  loggedInUserProfileId: number;
  userProfile!: UserProfile;
  loadedTabs: Set<string> = new Set();
  currentTab = '';
  pageNotFound!: boolean;
  showReplyRequestOpts = false;
  isFriendOptsVisible = false;
  moreActionOptsVisible = false;

  timeline: Post[] | undefined; 
  
  constructor(private activateRoute: ActivatedRoute,
    private post$: PostService,
    private renderer: Renderer2,
    private userService: UserService,
    private profileService: ProfileService,
    private router: Router,
    private auth: AuthenticationService,
    private title: Title,
    private location: Location,
    private message$: MessageService) {
    this.loggedInUserProfileId = auth.getProfileId();
  }

  ngOnDestroy(): void {
    
    console.log('destroyed');
    
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.renderer.setStyle(document.body, 'position', '');
  }

  ngOnInit(): void {
    this.initDefaultTab();
    

    this.router.events
    .pipe(takeUntil(this.destroyed$))
    .subscribe(event => {
      this.initDefaultTab();
    });

    this.message$.updateCoverPhoto
    .pipe(takeUntil(this.destroyed$))
    .subscribe(url => {
      this.userProfile.coverPhotoUrl = url;
    });

    this.message$.updateAvatar
    .pipe(takeUntil(this.destroyed$))
    .subscribe(url => {
      this.userProfile.avatar.url = url;
    });

    this.activateRoute.params
    .pipe(takeUntil(this.destroyed$))
    .subscribe(params => {
      const id = params['id'];
      if (id == null || !/\d+/g.test(id)) {
        this.pageError();
        return;
      }
      
      this.isBlocked(id);
      this.loadProfile(id);
    });

    // this.message$.onFriendRequestChange()
    // .pipe(takeUntil(this.destroyed$))
    // .subscribe(profileId => {
    //   console.log('friend request chagne');
      
    //   this.loadProfile(profileId);
    // });

    this.message$.onFriendshipStatusChange().subscribe(status => {
      this.userProfile.friendshipStatus = status;
    });
  }

  openChatBox(): void {
    this.message$.openChatBox.next({
      id: this.userProfile.userId,
      username: this.userProfile.fullName,
      avatarUrl: this.userProfile.avatar.url
    });
  }

  getTimeline(profileId: number): void {
    this.post$.getPostsByPageId(profileId).subscribe(posts => {
      this.timeline = posts;
    });
  }

  initDefaultTab(): void {
    let tabs = ['friends', 'photos', 'about'];
    for (let tab of tabs) {
      if (this.setDefaultTab(tab)) return;
    }
    if (this.loadedTabs.size == 0) this.loadedTabs.add('');
  }

  setDefaultTab(tab: string): boolean {
    let url = window.location.href;
    
    if (new RegExp('.*?/\\d+?/?' + tab).test(url)) {
      this.loadedTabs.add(tab);
      this.currentTab = tab;
      return true;
    }
    return false;
  }

  loadProfile(id: number): void {
    if (!id) return;
    this.message$.loadPostsByPageId(id);
    this.getTimeline(id);

    this.profileService.getUserProfile(id)
    .subscribe(resp => {
      this.pageNotFound = false;
      if (resp.isBlocked) this.pageError();
      this.title.setTitle(resp.fullName);

      this.userProfile = resp;
      this.message$.sendLoadedProfile(this.userProfile);
      this.profileLoaded.emit(this.userProfile);
    }, _ => {
      this.pageError();
    });
  }

  pageError(): void {
    this.pageNotFound = true;
    this.renderer.setStyle(document.body, 'position', 'fixed');
  }

  sendFriendRequest(): void {
    this.userService.sendFriendRequest(this.userProfile.userId)
        .subscribe(_ => {
          this.userProfile.friendshipStatus = 'SENT';
        });
  }

  deleteFriendRequest(): void {
    this.userService.deleteFriendRequest(this.userProfile.userId)
        .subscribe(_ => {
          this.userProfile.friendshipStatus = 'NULL';
          this.message$.sendDeleteFriendRequest(this.userProfile.userId);
        });
  }

  onReplyFriendRequestClicked(): void {
    this.showReplyRequestOpts = !this.showReplyRequestOpts;
  }

  closeReplyFriendRequestOpts(event: any) {
    this.showReplyRequestOpts = false;
  }

  unfriend(): void {
    this.userService.unfriend(this.userProfile.userId).subscribe(_ => {
      this.userProfile.friendshipStatus = 'NULL';
    });
  }

  acceptFriendRequest(): void {
    this.userService.acceptFriendRequest(this.userProfile.userId).subscribe(_ => {
      this.userProfile.friendshipStatus = 'FRIEND';
      this.message$.sendDeleteFriendRequest(this.userProfile.userId);
    });
  }

  switchTab(event: any, tab: string): void {
    event.preventDefault();
    this.loadedTabs.add(tab);
    this.currentTab = tab;
    this.location.go(`${this.userProfile.id}/${tab}`);
  }

  showUpdateProfilePic(type: string): void {
    this.isUpdateAvatar = true;
    this.message$.updateAvatarOrCover.next(type);
  }

  block(): void {
    this.userService.block(this.userProfile.userId).subscribe(_ => {
      this.userProfile.blocked = true;
    });
  }

  unblock(): void {
    this.userService.unblock(this.userProfile.userId).subscribe(_ => {
      this.userProfile.blocked = false;
    });
  }

  isBlocked(profileId: number): void {
    this.profileService.isBlocked(profileId).subscribe(isBlocked => {
      // if (isBlocked) this.pageError();
      this.pageNotFound = isBlocked;
    })
  }

}
