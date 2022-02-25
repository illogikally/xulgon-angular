import {Component, EventEmitter, HostListener, OnDestroy, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {RxStompService} from '@stomp/ng2-stompjs';
import { ClickOutsideDirective } from 'ng-click-outside';
import {NotificationService} from '../notification.service';
import { TitleService } from '../../share/title.service';
import {Notification} from './notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notifications!: Notification[];
  isPopupVisible = false;
  unreadCount = 0;

  constructor(
    private notificationService: NotificationService,
    private rxStompService: RxStompService,
    private titleService: TitleService
  ) {
  }

  ngOnInit(): void {
    this.notificationService.modifyUnread$.subscribe(quantity => {
      this.unreadCount += quantity;
      this.titleService.modifyNotificationCount(quantity);
    });

    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter(n => !n.isRead).length;
      this.titleService.modifyNotificationCount(this.unreadCount);
    });

    this.rxStompService.watch("/user/queue/notification").subscribe(message => {
      let notification = JSON.parse(message.body);
      this.notifications = this.notifications.filter(n => n.id != notification.id);
      this.notificationService.modifyUnread$.next(1);
      this.notifications.unshift(notification);
    });

    }
    @HostListener('window:click', ['$event'])
    onClick(event: any) {
      
    }


}
