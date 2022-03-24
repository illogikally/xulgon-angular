import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {filter} from 'rxjs/operators';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ConfirmDialogService} from '../../share/confirm-dialog/confirm-dialog.service';
import {UserService} from '../../share/user.service';

@Component({
  selector: 'app-friendship-button',
  templateUrl: './friendship-button.component.html',
  styleUrls: ['./friendship-button.component.scss']
})
export class FriendshipButtonComponent implements OnInit {

  @Input() userId!: number;
  @Input() friendshipStatus!: string;
  @Input() userName!: string;
  @Output() friendshipStatusChanged = new EventEmitter<string>();


  isWaitingConfirmation = false;
  principalId = this.authenticationService.getPrincipalId();
  isUpdating = false;

  constructor(
    private userService: UserService,
    private confirmService: ConfirmDialogService,
    private authenticationService: AuthenticationService

  ) { }

  ngOnInit(): void {
    this.userService.updateFriendshipStatus$.pipe(
      filter(data => data.userId == this.userId)
    ).subscribe(data => {

      this.friendshipStatus = data.status;
    });
  }

  sendFriendRequest() {
    this.isUpdating = true;
    this.userService.sendFriendRequest(this.userId).subscribe(() => {
      this.friendshipStatus = 'SENT';
      this.isUpdating = false;

      this.userService.updateFriendshipStatus$.next({
        userId: this.userId,
        status: 'SENT'
      });
    });
  }

  deleteFriendRequest() {
    this.isUpdating = true;
    this.userService.deleteFriendRequest(this.userId).subscribe(() => {
      this.friendshipStatus = 'NULL';
      this.isUpdating = false;
      this.userService.updateFriendshipStatus$.next({
        userId: this.userId,
        status: 'NULL'
      });
    });
  }

  async unfriend() {
    if (this.isWaitingConfirmation) return;

    const isConfirmed = await this.confirmService.confirm({
      title: `Huỷ kết bạn ${this.userName}`,
      body: `Bạn có chắc muốn huỷ kết bạn với ${this.userName}?`
    });

    if (isConfirmed) {
      this.isUpdating = true;
      this.userService.unfriend(this.userId).subscribe(() => {
        this.friendshipStatus = 'NULL';
        this.isUpdating = false;
        this.userService.updateFriendshipStatus$.next({
          userId: this.userId,
          status: 'NULL'
        });
      });
    }
  }

  acceptFriendRequest() {
    this.isUpdating = true;
    this.userService.acceptFriendRequest(this.userId) .subscribe(() => {
      this.friendshipStatus = 'FRIEND';
      this.isUpdating = false;
      this.userService.updateFriendshipStatus$.next({
        userId: this.userId,
        status: 'FRIEND'
      });
    });
  }

}
