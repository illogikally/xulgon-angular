import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ChatMessage } from '../chat/chat-msg';
import {GroupResponse} from '../group/group-response';
import {Post} from '../post/post';
import { OffsetResponse } from './offset-response';
import { UserBasic } from './user-basic';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) {
  }

  block(userId: number): Observable<any> {
    const url = `${this.baseApiUrl}/users/${userId}/block`;
    return this.http.post(url, {});
  }

  unblock(userId: number): Observable<any> {
    const url = `${this.baseApiUrl}/users/${userId}/block`;
    return this.http.delete(url)
  }

  sendFriendRequest(userId: number): Observable<any> {
    const url = `${this.baseApiUrl}/users/${userId}/friend-requests`;
    return this.http.post(url, {});
  }

  deleteFriendRequest(userId: number): Observable<any> {
    const url = `${this.baseApiUrl}/users/${userId}/friend-requests`;
    return this.http.delete(url);
  }

  unfriend(userId: number): Observable<any> {
    const url = `${this.baseApiUrl}/users/${userId}/friends`;
    return this.http.delete(url)
  }

  acceptFriendRequest(userId: number): Observable<any> {
    const url = `${this.baseApiUrl}/users/${userId}/friends`;
    return this.http.post(url, {});
  }

  getNewsFeed(size: number, offset: number): Observable<Post[]> {
    const url = `${this.baseApiUrl}/users/news-feed?size=${size}&offset=${offset}`;
    return this.http.get<Post[]>(url);
  }

  getJoinedGroups(): Observable<GroupResponse[]> {
    const url = `${this.baseApiUrl}/users/groups`
    return this.http.get<GroupResponse[]>(url);
  }

  unfollow(userId: number): Observable<any> {
    const url = `${this.baseApiUrl}/users/${userId}/unfollow`;
    return this.http.delete<any>(url);
  }

  isUserExisted(username: string): Observable<boolean> {
    console.log("Trigger API call");
    const url = `${this.baseApiUrl}/authentication/username-existed/${username}`;
    return this.http.get<boolean>(url);
  }

  isEmailExisted(email: string): Observable<boolean> {
    const url = `${this.baseApiUrl}/users/existed?email=${email}`
    return this.http.get<boolean>(url);
  }

  getFriends(userId: number): Observable<UserBasic[]> {
    const url = `${this.baseApiUrl}/users/${userId}/basic-friends`
    return this.http.get<UserBasic[]>(url);
  }

}
