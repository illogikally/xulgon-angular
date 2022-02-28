import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { ChatMessage } from './chat-msg';
import { ConversationNotif } from './conversation-notif';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseApiUrl = environment.baseApiUrl;
  private messagesApi = `${this.baseApiUrl}/messages`

  public openChatBox$ = new Subject<any>();

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient) {
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.messagesApi}/unread`);
  }

  getLatest(): Observable<ConversationNotif[]> {
    return this.http.get<ConversationNotif[]>(`${this.messagesApi}/latest`);
  }

  markAsRead(messageId: number): Observable<void> {
    return this.http.put<void>(`${this.messagesApi}/${messageId}/read`, {});
  }
  
  getMesssages(userId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.messagesApi}/with/${userId}`);
  }
}
