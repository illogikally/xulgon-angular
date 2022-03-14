import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
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

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.baseApiUrl + '/notifications');
  }

  read(id: number): Observable<void> {
    return this.http.put<void>(this.baseApiUrl + `/notifications/${id}/read`, {});
  }

}
