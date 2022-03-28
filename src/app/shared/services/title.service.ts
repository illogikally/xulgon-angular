import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  notificationCount = 0;
  title = '';
  constructor(
    private titleService: Title
  ) { }

  modifyNotificationCount(amount: number) {
    this.notificationCount += amount;
    this.updateTitle();
  }

  setTitle(title: string) {
    this.title = title;
    this.updateTitle();
  }

  private updateTitle() {
    const notif = this.notificationCount > 0
      ? `(${this.notificationCount})`
      : '';
    const title = `${notif} ${this.title}`;
    this.titleService.setTitle(title);
  }
}
