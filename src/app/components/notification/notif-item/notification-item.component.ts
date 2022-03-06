import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../authentication/authentication.service';
import {NotificationService} from '../notification.service';
import {Notification} from '../notification/notification';
import {NotificationType} from '../notification/notification-type';

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

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.constructPath();
  }

  constructPath() {
    let pageId = this.notification.pageId;
    let rootContentId = this.notification.rootContentId;
    let pageType = this.notification.pageType;
    this.path = `${pageType == 'GROUP' ? '/groups' : ''}/${pageId}/posts/${rootContentId}`;

    switch (this.notification.type) {
      case NotificationType.COMMENT:
        this.constructPathForCommentNotification();
        break;

      case NotificationType.REACTION:
        this.constructPathForReactNotification();
        break;

      case NotificationType.NEW_POST:
        this.constructPathForNewPostNotification();
        break;

      default:
        break;
    }
  }

  constructPathForNewPostNotification() {
    if (this.notification.pageType == 'PROFILE') {
      this.path = `/${this.notification.pageId}`;
    }
  }

  constructPathForCommentNotification() {
    if (this.notification.targetContentType == 'COMMENT') {
      this.queryParams.set('comment', this.notification.targetContentId);
      this.queryParams.set('child_comment', this.notification.actorContentId);
    }
    else {
      this.queryParams.set('comment', this.notification.actorContentId);
    }
  }

  constructPathForReactNotification() {
    if (this.notification.targetContentParentType == 'COMMENT') {
      this.queryParams.set('comment', this.notification.targetContentParentId);
      this.queryParams.set('child_comment', this.notification.targetContentId);
    }
    else if (this.notification.targetContentType == 'COMMENT') {
      this.queryParams.set('comment', this.notification.targetContentId);
    }
    if (this.queryParams.size == 0) {
      this.routeReuseScrollToTop = true;
    }
    this.queryParams.set('type', 'reaction');
  }

  read() {
    if (!this.notification.isRead) {
      this.notificationService.read(this.notification.id).subscribe(() => {
        this.notificationService.modifyUnread$.next(-1);
        this.notification.isRead = true;
      });
    }
  }

  click(): void {
    this.read();
    this.itemClick.emit();
    this.router.navigate([this.path], {
      state: {routeReuseScroll: this.routeReuseScrollToTop},
      queryParams: Object.fromEntries(this.queryParams)
    });
  }

}
