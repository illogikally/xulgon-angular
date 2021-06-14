import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  url = 'http://localhost:8080/api/profiles/'
  constructor(private http: HttpClient) { }

  getUserProfile(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.url + `${id}`);
  }

  isBlocked(profileId: number): Observable<boolean> {
    return this.http.get<boolean>(this.url + `${profileId}/is-blocked`);
  }

}
