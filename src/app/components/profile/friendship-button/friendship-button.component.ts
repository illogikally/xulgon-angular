import { Component, Input, OnInit } from '@angular/core';
import { ObjectUnsubscribedError, pipe } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { MessageService } from '../../share/message.service';
import { UserService } from '../../share/user.service';

@Component({
  selector: 'app-friendship-button',
  templateUrl: './friendship-button.component.html',
  styleUrls: ['./friendship-button.component.scss']
})
export class FriendshipButtonComponent implements OnInit {

  @Input() userId!: number;
  @Input() friendshipStatus!: string;
  @Input() userName!: string;


  isWaitingConfirmation = false;
  constructor(
    private userService: UserService,
    private messageService: MessageService

  ) { }

  ngOnInit(): void {
  }

  sendFriendRequest() {
    this.userService
    .sendFriendRequest(this.userId)
    .subscribe(() => {
      this.friendshipStatus = 'SENT';
    });
  }

  deleteFriendRequest() {
    this.userService
    .deleteFriendRequest(this.userId)
    .subscribe(() => {
      this.friendshipStatus = 'NULL';
    });
  }

  unfriend() {
    if (this.isWaitingConfirmation) return;
    let id = Date.now().toString();
    this.messageService.confirmDialog$.next({
      isPost: true,
      id: id,
      title: `Huỷ kết bạn ${this.userName}`,
      body: `Bạn có chắc muốn huỷ kết bạn với ${this.userName}?`
    });

    this.messageService.confirmDialog$
    .pipe(
      filter((response: any) => response.id == id),
      take(1)
    ).subscribe(response => {
      if (response.isConfirmed) {
        this.userService
        .unfriend(this.userId)
        .subscribe(() => {
          this.friendshipStatus = 'NULL';
        });
      }
    });
  }

  acceptFriendRequest() {
    this.userService
    .acceptFriendRequest(this.userId)
    .subscribe(() => {
      this.friendshipStatus = 'FRIEND';
    });
  }

}
