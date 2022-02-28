import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationService} from '../notification.service';
import {Notification} from '../notification/notification';
import { NotificationType } from '../notification/notification-type';

@Component({
  selector: 'app-notif-item',
  templateUrl: './notif-item.component.html',
  styleUrls: ['./notif-item.component.scss']
})
export class NotifItemComponent implements OnInit {

  @Input() notification!: Notification;
  @Output() itemClick = new EventEmitter();

  url = '';
  queryParams = {};
  NotificationType = NotificationType;

  constructor(
    private router: Router,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    let pageId = this.notification.pageId;
    let rcId = this.notification.rootContentId;
    let pageType = this.notification.pageType;
    switch (this.notification.type) {
      case 'COMMENT': {
        this.url = `${pageType == 'GROUP' ? '/groups' : ''}/${pageId}/posts/${rcId}`;
        if (this.notification.recipientContentType == 'COMMENT') {
          this.url += '?comment=' + this.notification.recipientContentId;
          this.url += '&child_comment=' + this.notification.actorContentId;
        }
        else {
          this.url += '?comment=' + this.notification.actorContentId;
        }
      }
    }
  }

  read(event?: any) {
    if (!this.notification.isRead) {
      this.notificationService.read(this.notification.id).subscribe(_ => {
        this.notificationService.modifyUnread$.next(-1);
        this.notification.isRead = true;
      });
    }
  }

  click(): void {
    this.read();
    this.itemClick.emit();
    this.router.navigateByUrl(this.url, {state: {routeReuseScroll: false}});
  }

}
