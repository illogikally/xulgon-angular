import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationService} from '../../service/notification.service';
import {Notification} from '../notification/notification';

@Component({
  selector: 'app-notif-item',
  templateUrl: './notif-item.component.html',
  styleUrls: ['./notif-item.component.scss']
})
export class NotifItemComponent implements OnInit {

  @Input() notification!: any;
  @Input() read!: EventEmitter<number>;
  url!: string;

  constructor(private router: Router,
              private notif$: NotificationService) {
  }

  click(): void {
    if (this.notification.isRead == false) {
      this.notif$.read(this.notification.id).subscribe(_ => {
        this.read.emit(this.notification.id);
        this.notification.isRead = true;
      });
    }
    this.router.navigateByUrl(this.url);
  }

  ngOnInit(): void {
    this.url = `/permalink/${this.notification.postId}`;
    switch (this.notification.type) {
      case 'COMMENT': {
        this.url += `?comment_id=${this.notification.contentId}`
      }
    }
  }

}
