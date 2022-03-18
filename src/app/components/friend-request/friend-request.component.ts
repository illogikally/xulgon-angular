import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { TitleService } from '../share/title.service';
import { UserService } from '../share/user.service';
import { FriendRequestDto } from './friend-request-dto';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss']
})
export class FriendRequestComponent implements OnInit {

  friendRequests: FriendRequestDto[] = [];
  profileId!: number;
  isProfilePicked: boolean = false;

  constructor(
    private auth: AuthenticationService,
    private titleService: TitleService,
    private userService: UserService,
    private rxStompService: RxStompService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Friends')

    let userId: number = this.auth.getPrincipalId();
    this.userService.getFriendRequests(userId).subscribe(resp => {
      this.friendRequests = resp;
    });
    this.listenToWebSocket();
  }

  onAttach() {
    this.titleService.setTitle('Friends')
  }


  preventDefault(event: any): void {
    event.preventDefault();
  }

  listenToWebSocket() {
    this.rxStompService.watch('/user/queue/friend-request').subscribe(message => {
      const request = JSON.parse(message.body);
      this.friendRequests = this.friendRequests.filter(r => {
        request.requesterId != r.requesterId;
      });
      this.friendRequests.push(request);
    });
  }

  deleteRequest(request: FriendRequestDto): void {
    this.friendRequests = this.friendRequests.filter(
      req => req.id !== request.id
    );
  }

  profilePicked(): void {
    this.isProfilePicked = true;
  }

}
