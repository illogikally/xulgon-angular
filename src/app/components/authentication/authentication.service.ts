import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {LoginRequest} from './login/login-request'
import {LoginResponse} from './login/login-response';
import {LocalStorageService} from 'ngx-webstorage';
import {map, switchMap, tap} from 'rxjs/operators'
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private baseApiUrl = environment.baseApiUrl;
  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage$: LocalStorageService
    ) {
  }

  login(loginRequest: LoginRequest): Observable<boolean> {
    console.log(loginRequest);
    const url = `${this.baseApiUrl}/authentication/token/retrieve`;
    return this.http.post<LoginResponse>(url, loginRequest)
      .pipe(map(data => {
        this.storeResponse(data);
        console.log(data);
        return true;
      }));
  }

  oauth2Login(
    code: string, 
    state: string,
    provider: string
  ): Observable<boolean> {
    const baseUrl = 'http://localhost:8080'
    const url = `${baseUrl}/login/oauth2/code/${provider}?code=${code}&state=${state}`;
    return this.http.get<any>(url).pipe(
      map(data => {
        this.storeResponse(data)
        console.log(data)
        return true;
      })
    );
  }

  oauthAuthorize(provider: string) {
    window.location.href = `${this.baseUrl}/oauth2/authorization/${provider}`;
  }

  getExpiresAt(): number {
    return this.getAuthentication()!.expiresAt;
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
    return this.getAuthentication()!.token;
  }


  storeResponse(data: LoginResponse): void {
    this.storage$.store('authentication', data);
  }

  refreshAuthToken(): Observable<LoginResponse> {
    const refreshRequest = {
      token: this.getAuthentication()!.refreshToken,
      username: this.getAuthentication()!.username
    }
    const url = `${this.baseApiUrl}/authentication/token/refresh`;
    return this.http.post<LoginResponse>(url, refreshRequest)
      .pipe(tap(response => {
        this.storage$.store('authentication', response);
        // this.storage$.store('expiresAt', response.expiresAt);
        // this.storage$.store('token', response.token);
      }));
  }

  getAuthentication(): LoginResponse | null {
    return this.storage$.retrieve('authentication');
  }

  getUserFullName(): string {
    return this.getAuthentication()!.userFullName;
  }

  getFirstName(): string {
    return this.getAuthentication()!.firstName;
  }

  getToken(): string {
    return this.getAuthentication()!.token;
  }

  getProfileId(): number {
    return this.getAuthentication()!.profileId;
  }

  getUsername(): string {
    return this.getAuthentication()!.username;
  }

  private getRefreshToken(): string {
    return this.getAuthentication()!.refreshToken;
  }

  getAvatarUrl(): string {
    return this.getAuthentication()!.avatarUrl || this.getDefaultAvatar();
  }

  getDefaultAvatar(): string {
    return  'assets/avatar.jpg';
  }

  getPrincipalId(): number {
    return this.getAuthentication()!.userId;
  }

  setAvatarUrl(url: string): void {
    let auth = this.getAuthentication()!;
    auth.avatarUrl = url;
    this.storage$.store('authentication', auth);
  }

  isLoggedIn(): boolean {
    return !!this.getAuthentication();
  }

  logout(): void {
    const url = `${this.baseApiUrl}/authentication/token/delete`;
    this.http.post(url, this.getAuthentication()!.refreshToken, {responseType: 'text'})
      .subscribe(_ => {
        this.storage$.clear('authentication');
        location.href = '/login';
      }, error => {
        throwError(error);
      });
  }

  register(req: any) {
    const url = `${this.baseApiUrl}/authentication/account/register`;
    return this.http.post(url, req);
  }
}
