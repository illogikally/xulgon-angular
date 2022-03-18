import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OffsetResponse } from '../share/offset-response';
import { Notification } from './notification/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  baseApiUrl = environment.baseApiUrl;
  public modifyUnread$ = new Subject<number>();

  constructor(
    private http: HttpClient,
  ) {
  }

  getNotifications(size: number, offset: number): Observable<OffsetResponse<Notification>> {
    const url = this.baseApiUrl + `/notifications?size=${size}&offset=${offset}`
    return this.http.get<OffsetResponse<Notification>>(url);
  }

  read(id: number): Observable<void> {
    return this.http.put<void>(this.baseApiUrl + `/notifications/${id}/read`, {});
  }

  getUnreadCount(): Observable<number> {
    const url = `${this.baseApiUrl}/notifications/unread`;
    return this.http.get<number>(url);
  }

}
