import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {UserProfile} from './user-profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  url = 'http://localhost:8080/api/profiles/'
  private baseApiUrl = environment.baseApiUrl;
  public friendshipStatus$ = new Subject<string>();

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
