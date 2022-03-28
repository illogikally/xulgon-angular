import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  private baseApiUrl = environment.baseApiUrl;
  constructor(
    private http: HttpClient
  ) { }

  followContent(contentId: number): Observable<any> {
    const url = `${this.baseApiUrl}/contents/${contentId}/follow`;
    return this.http.put<any>(url, {});
  }

  unfollowContent(contentId: number): Observable<any> {
    const url = `${this.baseApiUrl}/contents/${contentId}/unfollow`;
    return this.http.delete<any>(url);
  }

  followPage(pageId: number): Observable<any> {
    const url = `${this.baseApiUrl}/pages/${pageId}/follow`;
    return this.http.post(url, {});
  }

  unfollowPage(pageId: number): Observable<any> {
    const url = `${this.baseApiUrl}/pages/${pageId}/unfollow`;
    return this.http.delete(url, {});
  }
}
