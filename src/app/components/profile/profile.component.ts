import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { UserProfile } from './user-profile';
import { MessageService } from '../common/message.service';
import { UserService } from '../common/user.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  @Input() profileId!: number;

  @ViewChild('sidebar', {static: true}) sidebar!: ElementRef;
  @ViewChild('replyFriendRequest') replyRequestBtn!: ElementRef;
  @ViewChild('friend') friendBtn!: ElementRef;

  profileLoaded: EventEmitter<UserProfile> = new EventEmitter();

  isUpdateAvatar = false;
  loggedInUserProfileId: number;
  userProfile!: UserProfile;
  loadedTabs: Set<string> = new Set();
  currentTab: string = '';
  pageNotFound: boolean = false;
  showReplyRequestOpts: boolean = false;
  isFriendOptsVisible: boolean = false;

  constructor(private activateRoute: ActivatedRoute,
    private userService: UserService,
    private profileService: ProfileService,
    private router: Router,
    private auth: AuthenticationService,
    private location: Location,
    private messageService: MessageService) {
    this.loggedInUserProfileId = auth.getProfileId();
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
      const id = +params['id'];
      if (id != null) {
        this.messageService.pageId.next(id);
        
        this.loadProfile(id);
      }
    });

    this.messageService.onFriendRequestChange().subscribe(profileId => {
      this.loadProfile(profileId);
    });

    this.messageService.onFriendshipStatusChange().subscribe(status => {
      this.userProfile.friendshipStatus = status;
    });
  }

  initDefaultTab(): void {
    this.setDefaultTab('');
    this.setDefaultTab('friends');
    this.setDefaultTab('photos');
  }

  setDefaultTab(tab: string) {
    let url = window.location.href;
    if (new RegExp(tab).test(url)) {
      this.loadedTabs.add(tab);
      this.currentTab = tab;
    }
  }

  loadProfile(id: number): void {
    if (!id) return;

    this.profileService.getUserProfile(id).subscribe(resp => {
      this.userProfile = resp;
      this.messageService.sendLoadedProfile(this.userProfile);
      this.profileLoaded.emit(this.userProfile);
    }, error => {
      this.pageNotFound = true;
    });
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

}
