import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { FriendRequestDto } from './friend-request-dto';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss']
})
export class FriendRequestComponent implements OnInit {

  friendRequests!: FriendRequestDto[];
  profileId!: number;

  constructor(private auth: AuthenticationService,
    private http: HttpClient) { }

  ngOnInit(): void {
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

  changeProfile(event: any): void {
  }

}
