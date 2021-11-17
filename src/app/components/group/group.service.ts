import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../post/post';
import { GroupResponse } from './group-response';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  groupUrl = 'http://localhost:8080/api/groups/'
  constructor(private http: HttpClient) { }

  getJoinRequests(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(this.groupUrl + `${groupId}/join-requests`);
  }

  acceptRequest(requestId: number): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/group-join-requests/${requestId}/accept`, {});
  }

  declineRequest(requestId: number): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/api/group-join-requests/${requestId}`);
  }

  createGroup(request: any): Observable<number> {
    return this.http.post<number>(this.groupUrl, request);
  }

  leaveGroup(groupId: number): Observable<any> {
    return this.http.delete<any>(this.groupUrl + `${groupId}/quit`);
  }

  promote(userId: number, groupId: number): Observable<any> {
    return this.http.put<any>(this.groupUrl + `${groupId}/promote/${userId}`, {});
  }

  kick(userId: number, groupId: number): Observable<any> {
    return this.http.put<any>(this.groupUrl + `${groupId}/kick/${userId}`, {});
  }

  getTimeline(groupId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`http://localhost:8080/api/pages/${groupId}/posts`);
  }

}
