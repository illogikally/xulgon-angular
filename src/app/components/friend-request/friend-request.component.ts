import {LocationStrategy} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AuthenticationService} from '../authentication/authentication.service';
import {MessageService} from '../share/message.service';
import {FriendRequestDto} from './friend-request-dto';

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
              private locationStrategy: LocationStrategy,
              private messageService: MessageService,
              private title: Title,
              private http: HttpClient) {
    // history.pushState(null, this.title.getTitle(), window.location.href);
    // this.locationStrategy.onPopState(() => {
    //   history.pushState(null, this.title.getTitle(), window.location.href);
    // });
  }

  ngOnInit(): void {
    this.title.setTitle('Friends')

    // this.messageService.sendLoadedProfile({} as UserProfile);

    this.messageService.onDeleteFriendRequest().subscribe(userId => {
      this.friendRequests = this.friendRequests.filter(req => req.requesterId != userId);
    });

    let userId: number = this.auth.getPrincipalId();
    this.http.get<FriendRequestDto[]>(`http://localhost:8080/api/users/${userId}/friend-requests`)
      .subscribe(resp => {
        this.friendRequests = resp;
      })
  }

  preventDefault(event: any): void {
    event.preventDefault();
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
