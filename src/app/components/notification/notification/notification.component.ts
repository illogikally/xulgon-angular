import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { fromEvent } from 'rxjs';
import { TitleService } from '../../share/title.service';
import { NotificationService } from '../notification.service';
import { Notification } from './notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, AfterViewInit {

  notifications: Notification[] = [];
  isPopupVisible = false;
  unreadCount = 0;

  isLoading = false;
  hasNext = true;
  isInit = false;
  @ViewChild('notificationContainer') notificationContainer!: ElementRef;
  constructor(
    private notificationService: NotificationService,
    private rxStompService: RxStompService,
    private titleService: TitleService
  ) {
  }

  ngOnInit(): void {
    this.getUnreadCount();
    this.listenOnReadNotification();
    this.listenOnWebSocketNewNotification();
  }

  ngAfterViewInit(): void {
    this.configureLoadPhotoOnScroll();
  }

  getUnreadCount() {
    this.notificationService.getUnreadCount()
      .subscribe(unread => {
        this.titleService.modifyNotificationCount(unread)
        this.unreadCount = unread;
      });
  }

  listenOnWebSocketNewNotification() {
    this.rxStompService.watch("/user/queue/notification").subscribe(message => {
      let notification = JSON.parse(message.body);

      const existed = this.notifications.find(n => n.id == notification.id);

      if ((!existed && notification.isPreviousRead) || existed?.isRead) {
        this.notificationService.modifyUnread$.next(1);
      }

      this.notifications = this.notifications.filter(n => n.id != notification.id);
      this.notifications.unshift(notification);
    });
  }

  listenOnReadNotification() {
    this.notificationService.modifyUnread$.subscribe(quantity => {
      this.unreadCount += quantity;
      this.titleService.modifyNotificationCount(quantity);
      this.hoistUnread();
    });
  }

  async getInitNotifications() {
    for (let i = 0; i < 2; ++i) {
      await this.getNotifications();
    }
  }

  async getNotifications() {
    if (!this.hasNext) return;

    const size = 6;
    this.isLoading = true;
    const offset = this.notifications.length;
    const response = await this.notificationService.getNotifications(size, offset).toPromise();
    this.notifications = this.notifications.concat(response.data);
    this.hasNext = response.hasNext;
    this.isLoading = false;
    this.hoistUnread();
  }

  hoistUnread() {
    const unreads = this.notifications.filter(not => !not.isRead);
    const reads = this.notifications.filter(not => not.isRead);
    this.notifications = unreads.concat(reads);
  }

  showNotifications() {
    if (!this.isInit) {
      this.getInitNotifications();
    }
    this.isInit = true;
    this.isPopupVisible = !this.isPopupVisible;
  }

  configureLoadPhotoOnScroll() {
    fromEvent(this.notificationContainer.nativeElement, 'scroll').subscribe(() => {
      
      const photoContainer 
        = this.notificationContainer.nativeElement;
      if (
        photoContainer.scrollTop >= photoContainer.offsetHeight - photoContainer.offsetHeight
        && !this.isLoading
        && this.hasNext
      ) {
        this.getNotifications();
      }
    })
  }
}
