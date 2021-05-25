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
        this.localStorage.store('authenticationToken', data.token);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('expiresAt', data.expiresAt);

        return true;
      }));
  }

  getUserName(): string {
    return this.localStorage.retrieve('username');
  }

  getAuthenticationToken(): string {
    return this.localStorage.retrieve('authenticationToken');
  }

  getRefreshToken(): string {
    return this.localStorage.retrieve('refreshToken');
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
      }, error => {
        throwError(error);
      });
  }
}
