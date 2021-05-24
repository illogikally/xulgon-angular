import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { LoginRequest } from './login/login-request'
import { LoginResponse } from './login/login-response';
import { LocalStorageService } from 'ngx-webstorage';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(private httpClient: HttpClient,
    private localStorage: LocalStorageService) { }

  login(loginRequest: LoginRequest): void {
    this.httpClient.post<LoginResponse>("http://localhost:8080/api/authentication/login", loginRequest)
      .pipe(map(data => {
        this.localStorage.store('authenticationToken', data.token);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('expiresAt', data.expiresAt);

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
}
