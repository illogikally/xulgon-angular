import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {LoginRequest} from './login/login-request'
import {LoginResponse} from './login/login-response';
import {LocalStorageService} from 'ngx-webstorage';
import {map, switchMap, tap} from 'rxjs/operators'
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  refreshToken = {
    token: this.getRefreshToken(),
    username: this.getUsername()
  }


  constructor(private httpClient: HttpClient,
              private router: Router,
              private localStorage: LocalStorageService) {
  }

  login(loginRequest: LoginRequest): Observable<boolean> {
    return this.httpClient.post<LoginResponse>("http://localhost:8080/api/authentication/token/retrieve", loginRequest)
      .pipe(map(data => {
        this.store(data);
        return true;
      }));
  }

  getExpiresAt(): string {
    return this.localStorage.retrieve('expiresAt');
  }

  getWebsocketToken(): string {
    console.log('get websocket token');
    if (this.getExpiresAt() as unknown as number > new Date().getTime()) {
      console.log('refresh');
      this.refreshAuthToken().subscribe(() => {
      });
    }
    return this.getToken();
  }

  async stompBeforeConnect(): Promise<string> {
    if (this.getExpiresAt() as unknown as number > new Date().getTime()) {
      return await this.refreshAuthToken().pipe(switchMap((r: LoginResponse) => {
        return r.token;
      })).toPromise();
    }
    return this.getToken();
  }


  store(data: any): void {
    this.localStorage.store('avatarUrl', data.avatarUrl);
    this.localStorage.store('expiresAt', data.expiresAt);
    this.localStorage.store('profileId', data.profileId);
    this.localStorage.store('refreshToken', data.refreshToken);
    this.localStorage.store('token', data.token);
    this.localStorage.store('userFullName', data.userFullName);
    this.localStorage.store('userId', data.userId);
    this.localStorage.store('username', data.username);
  }

  refreshAuthToken(): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/authentication/token/refresh',
      this.refreshToken).pipe(tap(data => {
      this.localStorage.store('auth', data);
      this.localStorage.store('expiresAt', data.expiresAt);
      this.localStorage.store('token', data.token);
    }));
  }

  getAuth(): LoginResponse | undefined {
    return this.localStorage.retrieve('auth');
  }

  getUserFullName(): string | undefined {
    return this.getAuth()?.userFullName;
  }

  getFirstName(): string {
    return this.localStorage.retrieve('userFullName').split(' ').slice(-1)[0];
  }

  getToken(): string {
    return this.localStorage.retrieve('token');
  }

  getProfileId(): number {
    return this.localStorage.retrieve('profileId');
  }

  getUsername(): string {
    return this.localStorage.retrieve('username');
  }

  getRefreshToken(): string {
    return this.localStorage.retrieve('refreshToken');
  }

  getAvatarUrl(): string {
    return this.localStorage.retrieve('avatarUrl');
  }

  getUserId(): number {
    return this.localStorage.retrieve('userId');
  }

  setAvatarUrl(url: string): void {
    this.localStorage.store('avatarUrl', url);
  }

  isLoggedIn(): boolean {
    return this.getToken() != null;
  }

  logout(): void {
    this.httpClient.post('http://localhost:8080/api/authentication/token/delete',
      this.getRefreshToken(),
      {responseType: 'text'}
    ).subscribe(_ => {
      this.localStorage.clear('avatarUrl');
      this.localStorage.clear('expiresAt');
      this.localStorage.clear('profileId');
      this.localStorage.clear('refreshToken');
      this.localStorage.clear('token');
      this.localStorage.clear('userFullName');
      this.localStorage.clear('userId');
      this.localStorage.clear('username');
      this.router.navigateByUrl('/login');
    }, error => {
      throwError(error);
    });
  }
}
