import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Post } from '../post/post';
import { PageHeader } from './page-header';
import {UserProfile} from './user-profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private baseApiUrl = environment.baseApiUrl;
  public friendshipStatus$ = new Subject<string>();
  public onAttach$ = new Subject<number>();
  public onDetach$ = new Subject<number>();
  public onPostCreate$ = new Subject<Post>();

  constructor(private http: HttpClient) {}

  getUserProfile(id: number): Observable<UserProfile> {
    const url = `${this.baseApiUrl}/profiles/${id}`;
    return this.http.get<UserProfile>(url);
  }

  isBlocked(profileId: number): Observable<boolean> {
    const url = `${this.baseApiUrl}/profiles/${profileId}/is-blocked`;
    return this.http.get<boolean>(url);
  }

  getProfileHeader(id: number): Observable<any> {
    const url = `${this.baseApiUrl}/profiles/${id}/profile`;
    return this.http.get<any>(url);
  }
}
