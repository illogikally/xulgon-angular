import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import { environment } from 'src/environments/environment';
import {Post} from '../post/post';
import { OffsetResponse } from '../share/offset-response';
import { GroupResponse } from './group-response';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private baseApiUrl = environment.baseApiUrl;
  public attach$ = new ReplaySubject<number>(1);
  public detach$ = new ReplaySubject<number>(1);
  public groupResponse$ = new ReplaySubject<GroupResponse>(1);

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

  getTimeline(groupId: number): Observable<OffsetResponse<Post>> {
    const url = `${this.baseApiUrl}/pages/${groupId}/posts`;
    return this.http.get<OffsetResponse<Post>>(url);
  }

  getGroupHeader(groupId: number): Observable<GroupResponse> {
    const url = `${this.baseApiUrl}/groups/${groupId}`;
    return this.http.get<GroupResponse>(url);
  }

}
