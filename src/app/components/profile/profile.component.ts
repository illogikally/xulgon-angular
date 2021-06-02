import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from './profile.service';
import { UserProfile } from './user-profile';
import { DOCUMENT } from '@angular/common'
import { MessageService } from '../common/message.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  @Input() profileId!: number;
  userProfile!: UserProfile;
  pageNotFound: boolean = false;
  @ViewChild('sidebar', {static: true}) sidebar!: ElementRef;

  constructor(private activateRoute: ActivatedRoute,
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
    this.profileService.getUserProfile(id).subscribe(resp => {
      this.userProfile = resp;
      console.log(this.userProfile);
    }, error => {
      this.pageNotFound = true;
      console.log("page not found");
      
    });
  }

  onAddFriendClick(): void {
    this.profileService.addFriend(this.userProfile.userId)
        .subscribe(_ => {
          this.userProfile.friendshipStatus = 'SEND';
        });
  }

  onFriendClick(): void {

  }

  onDeleteFriendRequestClick(): void {
    this.profileService.deleteFriendRequest(this.userProfile.userId)
        .subscribe(_ => {
          this.userProfile.friendshipStatus = 'NULL';
        });
  }

  onRequestRespond(): void {

  }
}
