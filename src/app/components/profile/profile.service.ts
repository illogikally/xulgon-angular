import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Post } from '../post/post';
import { PhotoResponse } from '../share/photo/photo-response';
import { PageHeader } from './page-header';
import {UserPage} from './user-profile';

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

  getUserProfile(id: number): Observable<UserPage> {
    const url = `${this.baseApiUrl}/profiles/${id}`;
    return this.http.get<UserPage>(url);
  }

  isBlocked(profileId: number): Observable<boolean> {
    const url = `${this.baseApiUrl}/profiles/${profileId}/is-blocked`;
    return this.http.get<boolean>(url);
  }

  getProfileHeader(id: number): Observable<any> {
    const url = `${this.baseApiUrl}/profiles/${id}/profile`;
    return this.http.get<any>(url);
  }

  uploadCoverPhoto(data: FormData): Observable<PhotoResponse> {
    const url = `${this.baseApiUrl}/profiles/upload-cover`;
    return this.http.put<PhotoResponse>(url, data);
  }

  uploadAvatar(data: FormData): Observable<PhotoResponse> {
    const url = `${this.baseApiUrl}/profiles/upload-avatar`;
    return this.http.put<PhotoResponse>(url, data);
  }

  updateAvatar(photoId: number): Observable<PhotoResponse> {
    const url = `${this.baseApiUrl}/profiles/update-avatar`
    return this.http.put<PhotoResponse>(url, photoId);
  }

  updateCoverPhoto(photoId: number): Observable<PhotoResponse> {
    const url = `${this.baseApiUrl}/profiles/update-cover`
    return this.http.put<PhotoResponse>(url, photoId);
  }
}
