import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { UserProfile } from './user-profile';
import { DOCUMENT, Location } from '@angular/common'
import { MessageService } from '../common/message.service';
import { UserService } from '../common/user.service';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

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
  showFriendOpts: boolean = false;

  constructor(private activateRoute: ActivatedRoute,
    private userService: UserService,
    private profileService: ProfileService,
    private router: Router,
    private auth: AuthenticationService,
    private location: Location,
    private messageService: MessageService,
    @Inject(DOCUMENT) private document: Document) {
    this.profileId = this.activateRoute.snapshot.params.id;
    this.loggedInUserProfileId = auth.getProfileId();
  }

  ngOnInit(): void {
    this.setDefaultTab();

    this.router.events.subscribe(event => {
      this.setDefaultTab();
    });

    this.messageService.updateCoverPhoto.subscribe(url => {
      this.userProfile.coverPhotoUrl = url;
    });

    this.messageService.updateAvatar.subscribe(url => {
      this.userProfile.avatarUrl = url;
    });

    this.loadProfile(this.profileId);

    this.activateRoute.params.subscribe(params => {
      const id = +params['id'];
      this.loadProfile(id);
    });

    this.messageService.onFriendRequestChange().subscribe(profileId => {
      this.loadProfile(profileId);
    });

    this.messageService.onFriendshipStatusChange().subscribe(status => {
      this.userProfile.friendshipStatus = status;
    });
  }

  setDefaultTab(): void {
    let url = window.location.href;
    if (/friends$/g.test(url)) {
      this.loadedTabs.add('friends');
      this.currentTab = 'friends';
    }
    else if (/photos$/g.test(url)) {
      this.loadedTabs.add('photos');
      this.currentTab = 'photos';
    }
    else {
      this.loadedTabs.add('');
      this.currentTab = '';
    }
  }

  loadProfile(id: number): void {
    if (typeof id === 'undefined') {
      return;
    }
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
          this.userProfile.friendshipStatus = 'SEND';
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

    let btnAndChildren = [...this.replyRequestBtn.nativeElement.children,
                            this.replyRequestBtn.nativeElement];

    if (!btnAndChildren.includes(event.target)) {
      this.showReplyRequestOpts = false;
    }
    
  }

  onFriendClick(): void {
    this.showFriendOpts = !this.showFriendOpts;
  }

  closeFriendOpts(event: any): void {
    let btnAndChildren = [...this.friendBtn.nativeElement.children,
                            this.friendBtn.nativeElement];

    if (!btnAndChildren.includes(event.target)) {
      this.showFriendOpts = false;
    }
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

  changeCurrentTab(event: any, tab: string): void {
    event.preventDefault();
    this.loadedTabs.add(tab);
    this.currentTab = tab;
    this.location.go(`${this.userProfile.id}/${tab}`);
  }

  showUpdateProfilePic(type: string): void {
    this.isUpdateAvatar = true;
    this.messageService.updateAvatarOrCover.next(type);
  }

}
