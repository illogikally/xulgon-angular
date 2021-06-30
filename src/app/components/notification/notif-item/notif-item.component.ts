import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../service/notification.service';
import { Notification } from '../notification/notification';

@Component({
  selector: 'app-notif-item',
  templateUrl: './notif-item.component.html',
  styleUrls: ['./notif-item.component.scss']
})
export class NotifItemComponent implements OnInit {

  @Input() notif!: Notification;
  @Input() notifRead!: EventEmitter<number>;
  url!: string;

  constructor(private router: Router,
    private notif$: NotificationService) { 
  }

  click(): void {
    if (this.notif.isRead == false) {
      this.notif$.read(this.notif.id).subscribe(_ => {
        this.notifRead.emit(this.notif.id);
        this.notif.isRead = true;
      });
    }
    this.router.navigateByUrl(this.url);
  }

  ngOnInit(): void {
    this.url = `/permalink/${this.notif.postId}`;
    switch (this.notif.type) {
      case 'COMMENT': {
        this.url += `?comment_id=${this.notif.contentId}`
      }
    }
  }

}
