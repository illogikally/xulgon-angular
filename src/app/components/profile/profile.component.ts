import { Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { UserProfile } from './user-profile';
import { MessageService } from '../common/message.service';
import { UserService } from '../common/user.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

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

  isUpdateAvatar = false;
  loggedInUserProfileId: number;
  userProfile!: UserProfile;
  loadedTabs: Set<string> = new Set();
  currentTab = '';
  pageNotFound!: boolean;
  showReplyRequestOpts = false;
  isFriendOptsVisible = false;
  moreActionOptsVisible = false;
  
  constructor(private activateRoute: ActivatedRoute,
    private renderer: Renderer2,
    private userService: UserService,
    private profileService: ProfileService,
    private router: Router,
    private auth: AuthenticationService,
    private title: Title,
    private location: Location,
    private messageService: MessageService) {
    this.loggedInUserProfileId = auth.getProfileId();
  }

  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'position', '');
  }

  ngOnInit(): void {
    this.initDefaultTab();

    this.router.events.subscribe(event => {
      this.initDefaultTab();
    });

    this.messageService.updateCoverPhoto.subscribe(url => {
      this.userProfile.coverPhotoUrl = url;
    });

    this.messageService.updateAvatar.subscribe(url => {
      this.userProfile.avatar.url = url;
    });

    this.activateRoute.params.subscribe(params => {
      const id = params['id'];
      if (id == null || !/\d+/g.test(id)) {
        this.pageError();
        return;
      }
      
      this.isBlocked(id);
      this.loadProfile(id);
    });

    this.messageService.onFriendRequestChange().subscribe(profileId => {
      this.loadProfile(profileId);
    });

    this.messageService.onFriendshipStatusChange().subscribe(status => {
      this.userProfile.friendshipStatus = status;
    });
  }

  openChatBox(): void {
    this.messageService.openChatBox.next({
      id: this.userProfile.userId,
      username: this.userProfile.fullName,
      avatarUrl: this.userProfile.avatar.url
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
    this.messageService.loadPostsByPageId(id);

    this.profileService.getUserProfile(id).subscribe(resp => {
      this.pageNotFound = false;
      if (resp.isBlocked) this.pageError();
      this.title.setTitle(resp.fullName);

      this.userProfile = resp;
      this.messageService.sendLoadedProfile(this.userProfile);
      this.profileLoaded.emit(this.userProfile);
    }, error => {
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
          this.messageService.sendDeleteFriendRequest(this.userProfile.userId);
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
      this.messageService.sendDeleteFriendRequest(this.userProfile.userId);
    });
  }

  switchTab(event: any, tab: string): void {
    event.preventDefault();
    this.loadedTabs.add(tab);
    this.currentTab = tab;
    // this.location.go(`${this.userProfile.id}/${tab}`);
    this.location.go(`${this.userProfile.id}/${tab}`);
  }

  showUpdateProfilePic(type: string): void {
    this.isUpdateAvatar = true;
    this.messageService.updateAvatarOrCover.next(type);
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
