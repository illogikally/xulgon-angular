import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../core/authentication/authentication.service';
import {NotificationService} from '../notification.service';
import {Notification} from '../notification/notification';
import {NotificationType} from '../notification/notification-type';
import {UserService} from '../../shared/services/user.service';
import {GroupService} from '../../group/group.service';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent implements OnInit {

  @Input() notification!: Notification;
  @Output() itemClick = new EventEmitter();

  path = '';
  queryParams = new Map<string, any>();
  NotificationType = NotificationType;

  routeReuseScrollToTop = false;
  principalId = this.authenticationService.getPrincipalId();
  avatarIcon: 'bell' | 'friend' | 'post' | 'comment' | 'reaction' | 'group' = 'bell';

  constructor(
    private groupService: GroupService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private userService: UserService

  ) {
  }

  ngOnInit(): void {
    this.constructPath();
  }

  constructPath() {
    let pageId = this.notification.pageId;
    let rootContentId = this.notification.rootContent?.id;
    let pageType = this.notification.pageType;
    if (this.notification?.rootContent?.type == 'PHOTO') {
      this.path = `/photo/${rootContentId}`;
    }
    else {
      this.path = `${pageType == 'GROUP' ? '/groups' : ''}/${pageId}/posts/${rootContentId}`;
    }

    switch (this.notification.type) {
      case NotificationType.COMMENT:
        this.constructPathForCommentNotification();
        this.avatarIcon = 'comment';
        break;

      case NotificationType.REACTION:
        this.constructPathForReactNotification();
        this.avatarIcon = 'reaction';
        break;

      case NotificationType.NEW_POST:
        this.constructPathForNewPostNotification();
        this.avatarIcon = 'post';
        break;

      case NotificationType.GROUP_JOIN_REQUEST:
        this.constructPathForGroupJoinRequestNotification();
        this.avatarIcon = 'group';
        break;

      case NotificationType.FRIEND_REQUEST:
        this.constructPathForFriendRequestNotification();
        this.avatarIcon = 'friend';
        break;

      case NotificationType.FRIEND_REQUEST_ACCEPT:
        this.constructPathForFriendAcceptanceNotification();
        this.avatarIcon = 'friend';
        this.userService.updateFriendshipStatus$.next({
          userId: this.notification.actor.id,
          status: 'FRIEND'
        });
        break;

      case NotificationType.GROUP_JOIN_REQUEST_ACCEPT:
        this.constructPathForGroupAcceptanceNotification();
        this.avatarIcon = 'group';
        this.groupService.groupMemberAccepted$.next(this.notification.pageId);
        break;

      default:
        break;
    }
  }

  constructPathForFriendRequestNotification() {
    this.path = `/friends`
  }

  constructPathForGroupJoinRequestNotification() {
    this.path = `/groups/${this.notification.pageId}/member_request`;
  }

  constructPathForNewPostNotification() {
    if (this.notification.pageType == 'PROFILE') {
      this.path = `/${this.notification.pageId}`;
    }
  }

  constructPathForCommentNotification() {
    if (this.notification.targetContent?.type == 'COMMENT') {
      this.queryParams.set('comment', this.notification.targetContent.id);
      this.queryParams.set('child_comment', this.notification.actorContent.id);
    }
    else {
      this.queryParams.set('comment', this.notification.actorContent.id);
    }
  }

  constructPathForGroupAcceptanceNotification() {
    this.path = `/groups/${this.notification.pageId}`
  }

  constructPathForFriendAcceptanceNotification() {
    this.path = `/${this.notification.pageId}`
  }

  constructPathForReactNotification() {
    if (this.notification.targetContetParent?.type == 'COMMENT') {
      this.queryParams.set('comment', this.notification.targetContetParent?.id);
      this.queryParams.set('child_comment', this.notification.targetContent?.id);
    }
    else if (this.notification.targetContent.type == 'COMMENT') {
      this.queryParams.set('comment', this.notification.targetContent?.id);
    }
    if (this.queryParams.size == 0) {
      // this.routeReuseScrollToTop = true;
    }
    this.queryParams.set('type', 'reaction');
  }

  read() {
    if (!this.notification.isRead) {
      this.notificationService.read(this.notification.id).subscribe(() => {
        this.notification.isRead = true;
        this.notificationService.modifyUnread$.next(-1);
      });
    }
  }

  click(): void {
    this.read();
    this.itemClick.emit();
    this.router.navigate([this.path], {
      state: { routeReuseScroll: this.routeReuseScrollToTop },
      queryParams: Object.fromEntries(this.queryParams)
    });
  }

}
