import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {LoginRequest} from './login/login-request'
import {LoginResponse} from './login/login-response';
import {LocalStorageService} from 'ngx-webstorage';
import {map, switchMap, tap} from 'rxjs/operators'
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage$: LocalStorageService
    ) {
  }

  login(loginRequest: LoginRequest): Observable<boolean> {
    const url = `${this.baseApiUrl}/authentication/token/retrieve`;
    return this.http.post<LoginResponse>(url, loginRequest)
      .pipe(map(data => {
        this.store(data);
        return true;
      }));
  }

  oauth2(
    code: string, 
    state: string,
    provider: string
    ): Observable<boolean> {
      const baseUrl = 'http://localhost:8080'
      const url = `${baseUrl}/login/oauth2/code/${provider}?code=${code}&state=${state}`;
      return this.http.get<any>(url)
        .pipe(map(data => {
          // this.store(data);
          console.log(data)
          return true;
        }));
  }

  getExpiresAt(): number {
    return this.storage$.retrieve('expiresAt');
  }

  async fetchToken(): Promise<string> {
    const expiresAt = this.getExpiresAt();
    const current = new Date().getTime();
    
    if (expiresAt - current < 10_000) {
      return await this.refreshAuthToken()
        .pipe(switchMap((r: LoginResponse) => {
          return r.token;
        })).toPromise();
    }
    return this.getToken();
  }


  store(res: LoginResponse): void {
    console.log('expires at ', res.expiresAt);
    
    this.storage$.store('avatarUrl', res.avatarUrl);
    this.storage$.store('expiresAt', res.expiresAt);
    this.storage$.store('profileId', res.profileId);
    this.storage$.store('refreshToken', res.refreshToken);
    this.storage$.store('token', res.token);
    this.storage$.store('userFullName', res.userFullName);
    this.storage$.store('userId', res.userId);
    this.storage$.store('username', res.username);
  }

  refreshAuthToken(): Observable<LoginResponse> {
    const refreshRequest = {
      token: this.getRefreshToken(),
      username: this.getUsername()
    }
    const url = `${this.baseApiUrl}/authentication/token/refresh`;
    return this.http.post<LoginResponse>(url, refreshRequest)
      .pipe(tap(data => {
        this.storage$.store('auth', data);
        this.storage$.store('expiresAt', data.expiresAt);
        this.storage$.store('token', data.token);
      }));
  }

  getAuth(): LoginResponse | undefined {
    return this.storage$.retrieve('auth');
  }


  getUserFullName(): string | undefined {
    return this.getAuth()?.userFullName;
  }

  getFirstName(): string {
    return this.storage$.retrieve('userFullName').split(' ').slice(-1)[0];
  }

  getToken(): string {
    return this.storage$.retrieve('token');
  }

  getProfileId(): number {
    return this.storage$.retrieve('profileId');
  }

  getUsername(): string {
    return this.storage$.retrieve('username');
  }

  private getRefreshToken(): string {
    return this.storage$.retrieve('refreshToken');
  }

  getAvatarUrl(): string {
    return this.storage$.retrieve('avatarUrl');
  }

  getUserId(): number {
    return this.storage$.retrieve('userId');
  }

  setAvatarUrl(url: string): void {
    this.storage$.store('avatarUrl', url);
  }

  isLoggedIn(): boolean {
    return this.getToken() != null;
  }

  logout(): void {
    this.http.post('http://localhost:8080/api/authentication/token/delete',
      this.getRefreshToken(),
      {responseType: 'text'}
    ).subscribe(_ => {
      this.storage$.clear('avatarUrl');
      this.storage$.clear('expiresAt');
      this.storage$.clear('profileId');
      this.storage$.clear('refreshToken');
      this.storage$.clear('token');
      this.storage$.clear('userFullName');
      this.storage$.clear('userId');
      this.storage$.clear('username');
      location.href = '/login';
    }, error => {
      throwError(error);
    });
  }
}
