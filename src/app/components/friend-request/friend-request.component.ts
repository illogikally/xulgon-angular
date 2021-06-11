import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { MessageService } from '../common/message.service';
import { UserProfile } from '../profile/user-profile';
import { FriendRequestDto } from './friend-request-dto';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss']
})
export class FriendRequestComponent implements OnInit {

  friendRequests!: FriendRequestDto[];
  profileId!: number;
  isProfilePicked: boolean = false;

  constructor(private auth: AuthenticationService,
    private messageService: MessageService,
    private http: HttpClient) { }

  ngOnInit(): void {

    this.messageService.sendLoadedProfile({} as UserProfile);
    this.messageService.onDeleteFriendRequest().subscribe(userId => {
      this.friendRequests = this.friendRequests.filter(req => req.requesterId != userId);
    });
    let userId: number = this.auth.getUserId();
    this.http.get<FriendRequestDto[]>(`http://localhost:8080/api/users/${userId}/friend-requests`)
        .subscribe(resp => {
          console.log(this.friendRequests);
          
          this.friendRequests = resp;
        })
  }

  preventDefault(event: any): void {
    event.preventDefault();
  }

  deleteRequest(request: FriendRequestDto): void {
    this.friendRequests = this.friendRequests .filter(
        req => req.id !== request.id
    );
  }

  changeProfile(event: any): void {
  }

  profilePicked(): void {
    
    this.isProfilePicked = true;
    console.log(this.isProfilePicked);
  }

}
