import { Component, Input, OnInit } from '@angular/core';
import { ObjectUnsubscribedError, pipe } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ConfirmDialogService } from '../../share/confirm-dialog/confirm-dialog.service';
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
    private messageService: MessageService,
    private confirmService: ConfirmDialogService

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

  async unfriend() {
    if (this.isWaitingConfirmation) return;

    const isConfirmed = await this.confirmService.confirm({
      title: `Huỷ kết bạn ${this.userName}`,
      body: `Bạn có chắc muốn huỷ kết bạn với ${this.userName}?`
    });

    if (isConfirmed) {
      this.userService
      .unfriend(this.userId)
      .subscribe(() => {
        this.friendshipStatus = 'NULL';
      });
    }
  }

  acceptFriendRequest() {
    this.userService
    .acceptFriendRequest(this.userId)
    .subscribe(() => {
      this.friendshipStatus = 'FRIEND';
    });
  }

}
