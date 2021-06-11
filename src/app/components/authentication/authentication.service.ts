import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { LoginRequest } from './login/login-request'
import { LoginResponse } from './login/login-response';
import { LocalStorageService } from 'ngx-webstorage';
import { map, tap } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  refreshToken = {
    token: this.getRefreshToken(),
    username: this.getUserName()
  }

  constructor(private httpClient: HttpClient,
    private localStorage: LocalStorageService) { }

  login(loginRequest: LoginRequest): Observable<boolean> {
    return this.httpClient.post<LoginResponse>("http://localhost:8080/api/authentication/token/retrieve", loginRequest)
      .pipe(map(data => {
        this.localStorage.store('auth', data);
        this.localStorage.store('authenticationToken', data.token);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('expiresAt', data.expiresAt);
        this.localStorage.store('userId', data.userId);
        this.localStorage.store('avatarUrl', data.avatarUrl);
        this.localStorage.store('profileId', data.profileId);

        return true;
      }));
  }

  getAuth(): any {
    return this.localStorage.retrieve('auth');
  }

  getUserName(): string {
    return this.localStorage.retrieve('username');
  }

  getAuthenticationToken(): string {
    return this.localStorage.retrieve('authenticationToken');
  }

  getProfileId(): number {
    return this.localStorage.retrieve('profileId');
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
    return this.getAuthenticationToken() != null;
  }

  logout(): void {
    this.httpClient.post('http://localhost:8080/api/authentication/token/delete', this.getRefreshToken(), {responseType: 'text'})
      .subscribe(_ => {
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('expiresAt');
        this.localStorage.clear('refreshToken');
        this.localStorage.clear('username');
        this.localStorage.clear('userId');
        this.localStorage.clear('auth');
        this.localStorage.clear('profileId');
        this.localStorage.clear('avatarUrl');
      }, error => {
        throwError(error);
      });
  }
}
