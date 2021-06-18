import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
}
