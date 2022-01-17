import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../authentication/authentication.service';
import {ConversationNotif} from '../chat/conversation-notif';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messagesApi = "http://localhost:8080/api/messages/"

  constructor(private authService: AuthenticationService,
              private http: HttpClient) {
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(this.messagesApi + "unread");
  }

  getLatest(): Observable<ConversationNotif[]> {
    return this.http.get<ConversationNotif[]>(this.messagesApi + "latest");
  }

  markAsRead(messageId: number): Observable<void> {
    return this.http.put<void>(this.messagesApi + `${messageId}/read`, {});
  }
}
