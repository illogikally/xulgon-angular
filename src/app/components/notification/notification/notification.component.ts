import {Component, EventEmitter, OnInit} from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {NotificationService} from '../../service/notification.service';
import {Notification} from './notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notifItems!: any[];
  popupVisible = false;
  unreadCount = 0;

  notifRead = new EventEmitter<number>();

  constructor(private notif$: NotificationService,
              private rxStomp$: RxStompService) {
  }

  ngOnInit(): void {
    this.notifRead.subscribe(id => {
      this.unreadCount--;
    });

    this.notif$.getNotifs().subscribe(notifs => {
      this.notifItems = notifs;
      this.unreadCount = notifs.filter(notif => !notif.isRead).length;
    });

    this.rxStomp$.watch("/user/queue/notification").subscribe(msg => {
      let notif = JSON.parse(msg.body);
      console.log(notif);
      this.notifItems.unshift(notif);
    });
  }


}
