import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { Notification } from '../notification/notification/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notificationApi = 'http://localhost:8080/api/notifications/'
  constructor(private http: HttpClient,
    private authService: AuthenticationService) {
    
  }

  getNotifs(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.notificationApi);
  }

  read(id: number): Observable<void> {
    return this.http.put<void>(this.notificationApi + `${id}/read`, {});
  }

}
