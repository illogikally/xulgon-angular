import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Notification } from './notification/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notificationApi = 'http://localhost:8080/api/notifications/'
  public modifyUnread$ = new Subject<number>();

  constructor(
    private http: HttpClient,
  ) {
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.notificationApi);
  }

  read(id: number): Observable<void> {
    return this.http.put<void>(this.notificationApi + `${id}/read`, {});
  }

}
