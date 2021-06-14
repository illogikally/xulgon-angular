import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = 'http://localhost:8080/api/users/'
  constructor(private http: HttpClient) { }

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
}
