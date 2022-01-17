import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {GroupResponse} from '../group/group-response';
import {Post} from '../post/post';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = 'http://localhost:8080/api/users/'

  constructor(private http: HttpClient) {
  }

  block(userId: number): Observable<any> {
    return this.http.post(this.url + `${userId}/block`, {});
  }

  unblock(userId: number): Observable<any> {
    return this.http.delete(this.url + `${userId}/block`)
  }

  sendFriendRequest(userId: number): Observable<any> {
    return this.http.post(this.url + `${userId}/friend-requests`, {});
  }

  deleteFriendRequest(userId: number): Observable<any> {
    return this.http.delete(this.url + `${userId}/friend-requests`);
  }

  unfriend(userId: number): Observable<any> {
    return this.http.delete(this.url + `${userId}/friends`)
  }

  acceptFriendRequest(userId: number): Observable<any> {
    return this.http.post(this.url + `${userId}/friends`, {});
  }

  getGroupFeed(): Observable<Post[]> {
    return this.http.get<Post[]>(this.url + 'group-feed');
  }

  getNewsFeed(size: number, offset: number): Observable<Post[]> {
    return this.http.get<Post[]>(this.url + `news-feed?size=${size}&offset=${offset}`);
  }

  getJoinedGroups(): Observable<GroupResponse[]> {
    return this.http.get<GroupResponse[]>(this.url + "groups");
  }

  unfollow(userId: number): Observable<any> {
    return this.http.delete<any>(this.url + `${userId}/unfollow`);
  }
}
