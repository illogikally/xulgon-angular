import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AuthenticationService} from 'src/app/core/authentication/authentication.service';
import {FollowService} from 'src/app/shared/services/follow.service';
import {UserDto} from 'src/app/shared/models/user-dto';
import {UserService} from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-friend-list-item',
  templateUrl: './friend-list-item.component.html',
  styleUrls: ['./friend-list-item.component.scss']
})
export class FriendListItemComponent implements OnInit {

  @Input() userDto!: UserDto;
  @Input() pageId!: number;
  @ViewChild('optionsBtn') optionsBtn!: ElementRef;
  @Output() removeItem: EventEmitter<UserDto> = new EventEmitter();

  constructor(
    private followService: FollowService,
    private userService: UserService,
    public auth: AuthenticationService) {
  }

  ngOnInit(): void {
  }

  unfriend(): void {
    this.userService.unfriend(this.userDto.id).subscribe(() => {
      this.removeItem.emit(this.userDto);
    });
  }

  unfollow(): void {
    this.followService.unfollowPage(this.userDto.id).subscribe(() => {
      this.userDto.isFollow = false;
    });
  }
}
