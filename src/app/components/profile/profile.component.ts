import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from './profile.service';
import { UserProfile } from './user-profile';
import { DOCUMENT } from '@angular/common'
import { MessageService } from '../common/message.service';
import { UserService } from '../common/user.service';

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

  userProfile!: UserProfile;
  pageNotFound: boolean = false;
  showReplyRequestOpts: boolean = false;
  showFriendOpts: boolean = false;

  constructor(private activateRoute: ActivatedRoute,
    private userService: UserService,
    private profileService: ProfileService,
    private messageService: MessageService,
    @Inject(DOCUMENT) private document: Document) {

    this.profileId = this.activateRoute.snapshot.params.id;
  }

  ngOnInit(): void {
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

  loadProfile(id: number): void {
    if (typeof id === 'undefined') {
      return;
    }
    this.profileService.getUserProfile(id).subscribe(resp => {
      this.userProfile = resp;
      console.log(this.userProfile);
    }, error => {
      this.pageNotFound = true;
      console.log("page not found");
      
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
    });
  }



}
