import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  sendFriendRequest(userId: number): Observable<any> {
    return this.http.post(`http://localhost:8080/api/users/${userId}/friend-requests`, {});
  }

  deleteFriendRequest(userId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/users/${userId}/friend-requests`);
  }

  unfriend(userId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/users/${userId}/friends`)
  }
  
  acceptFriendRequest(userId: number): Observable<any> {
    return this.http.post(`http://localhost:8080/api/users/${userId}/friends`, {});
  }
}
