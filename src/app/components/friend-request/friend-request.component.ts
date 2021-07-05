import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
    private title: Title,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.title.setTitle('Friends')

    this.messageService.sendLoadedProfile({} as UserProfile);

    this.messageService.onDeleteFriendRequest().subscribe(userId => {
      this.friendRequests = this.friendRequests.filter(req => req.requesterId != userId);
    });

    let userId: number = this.auth.getUserId();
    this.http.get<FriendRequestDto[]>(`http://localhost:8080/api/users/${userId}/friend-requests`)
        .subscribe(resp => {
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

  profilePicked(): void {
    this.isProfilePicked = true;
  }

}
