import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import {Post} from '../post/post';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) {}

  getJoinRequests(groupId: number): Observable<any[]> {
    const url = `${this.baseApiUrl}/groups/${groupId}/join-requests`;
    return this.http.get<any[]>(url);
  }

  acceptRequest(requestId: number): Observable<any> {
    const url = `${this.baseApiUrl}/group-join-requests/${requestId}/accept`;
    return this.http.put<any>(url, {});
  }

  declineRequest(requestId: number): Observable<any> {
    const url = `${this.baseApiUrl}/group-join-requests/${requestId}`;
    return this.http.delete<any>(url);
  }

  createGroup(request: any): Observable<number> {
    const url = `${this.baseApiUrl}/groups`;
    return this.http.post<number>(url, request);
  }

  leaveGroup(groupId: number): Observable<any> {
    const url = `${this.baseApiUrl}/groups/${groupId}/quit`;
    return this.http.delete<any>(url);
  }

  promote(userId: number, groupId: number): Observable<any> {
    const url = `${this.baseApiUrl}/groups/${groupId}/promote/${userId}`;
    return this.http.put<any>(url, {});
  }

  kick(userId: number, groupId: number): Observable<any> {
    const url = `${this.baseApiUrl}/groups/${groupId}/kick/${userId}`;
    return this.http.put<any>(url, {});
  }

  getTimeline(groupId: number): Observable<Post[]> {
    const url = `http://localhost:8080/api/pages/${groupId}/posts`;
    return this.http.get<Post[]>(url);
  }

}
