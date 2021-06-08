import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserProfile(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`http://localhost:8080/api/profiles/${id}`);
  }

  sendFriendRequest(id: number): Observable<any> {
    return this.http.post(`http://localhost:8080/api/users/${id}/friend-requests`, {});
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
