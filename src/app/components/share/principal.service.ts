import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { PhotoResponse } from './photo/photo-response';

@Injectable({
  providedIn: 'root'
})
export class PrincipalService {

  private baseApiUrl = environment.baseApiUrl;
  private avatar?: PhotoResponse;
  private defaultAvatarUrl = 'assets/avatar.jpg';
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { 
    const url = `${this.baseApiUrl}/users/${this.authenticationService.getProfileId()}/avatar`;
    this.http.get<PhotoResponse>(url).subscribe(avatar => {
      this.avatar = avatar;
    });
  }

  getAvatarUrl(): string {
    return this.avatar?.thumbnails.s40x40.url || this.defaultAvatarUrl;
  }
}
