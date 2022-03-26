import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Post} from '../post/post';
import {OffsetResponse} from '../share/offset-response';
import {GroupResponse} from './group-response';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private baseApiUrl = environment.baseApiUrl;
  public attach$ = new ReplaySubject<number>(1);
  public detach$ = new ReplaySubject<number>(1);
  public groupMemberAccepted$ = new Subject<number>();
  private groupResponse$ = new ReplaySubject<GroupResponse>(1);

  constructor(private http: HttpClient) {}

  currentGroup(): Observable<GroupResponse> {
    return this.groupResponse$.asObservable();
  }

  nextCurrentGroup(group: GroupResponse) {
    this.groupResponse$.next(group);
  }

  getJoinRequests(groupId: number): Observable<any[]> {
    const url = `${this.baseApiUrl}/groups/${groupId}/join-requests`;
    return this.http.get<any[]>(url);
  }

  getMembers(groupId: number): Observable<any[]> {
    const url = `${this.baseApiUrl}/groups/${groupId}/members`;
    return this.http.get<any[]>(url);
  }

  getRole(groupId: number): Observable<string> {
    const url = `${this.baseApiUrl}/groups/${groupId}/role`;
    return this.http.get<string>(url);
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

  getGroupFeed(
    size: number,
    offset: number,
  ): Observable<OffsetResponse<Post>> {
    const url = `${this.baseApiUrl}/users/group-feed?size=${size}&offset=${offset}`;
    return this.http.get<OffsetResponse<Post>>(url);
  }

  getTimeline(
    groupId: number,
    size: number,
    offset: number
  ): Observable<OffsetResponse<Post>> {
    const url = `${this.baseApiUrl}/pages/${groupId}/posts?size=${size}&offset=${offset}`;
    return this.http.get<OffsetResponse<Post>>(url);
  }

  getGroupHeader(groupId: number): Observable<GroupResponse> {
    const url = `${this.baseApiUrl}/groups/${groupId}`;
    return this.http.get<GroupResponse>(url);
  }

  sendJoinRequest(groupId: number): Observable<any> {
    const url = `${this.baseApiUrl}/groups/${groupId}/join-requests`;
    return this.http.post(url, {})
  }

  cancelJoinRequest(groupId: number): Observable<any> {
    const url = `${this.baseApiUrl}/groups/${groupId}/join-requests`;
    return this.http.delete(url, {})
  }

  demote(memberId: number, groupId: number): Observable<any> {
    const url = `${this.baseApiUrl}/groups/${groupId}/demote/${memberId}`;
    return this.http.put(url, {});
  }

  getDefaultCoverPhotoUrl(): string {
    return 'https://xulgon.sirv.com/assets/cover.png';
  }

  getGroups(size: number, offset: number): Observable<OffsetResponse<GroupResponse>> {
    const url = `${this.baseApiUrl}/groups?size=${size}&offset=${offset}`;
    return this.http.get<OffsetResponse<GroupResponse>>(url);
  }

  getDefaultCoverUrl() {
    return 'https://xulgon.sirv.com/assets/cover.png';
  }
}
