import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { PhotoResponse } from './photo/photo-response';
import { SirvPipe } from './sirv.pipe';

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
    const url = `${this.baseApiUrl}/users/${this.authenticationService.getPrincipalId()}/avatar`;
    this.http.get<PhotoResponse>(url).subscribe(avatar => {
      this.avatar = avatar;
    });
  }

  async getAvatarUrl(size: 40 | 100 | 200 | 400 | 600 | 900): Promise<any> {
    while (this.avatar === undefined) {
      await new Promise(r => setTimeout(r, 50));
    }
    return new SirvPipe().transform(this.avatar.url, size) || this.defaultAvatarUrl;
  }
}
