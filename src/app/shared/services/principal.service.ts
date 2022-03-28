import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {AuthenticationService} from '../../core/authentication/authentication.service';
import {PhotoResponse} from '../components/photo/photo-response';

@Injectable({
  providedIn: 'root'
})
export class PrincipalService {

  private baseApiUrl = environment.baseApiUrl;
  private avatar?: PhotoResponse;
  private defaultAvatarUrl = 'https://xulgon.sirv.com/assets/avatar.jpg';
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    const url = `${this.baseApiUrl}/users/${this.authenticationService.getPrincipalId()}/avatar`;
    this.http.get<PhotoResponse>(url).subscribe(avatar => {
      this.avatar = avatar;
    });
  }

  async getAvatarUrl(): Promise<string> {
    while (this.avatar === undefined) {
      await new Promise(r => setTimeout(r, 50));
    }
    return this.avatar?.url || '';
  }
}
