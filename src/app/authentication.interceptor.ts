import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { AuthenticationService } from './components/authentication/authentication.service';
import { catchError, switchMap, take, filter } from 'rxjs/operators';
import { LoginResponse } from './components/authentication/login/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationInterceptor implements HttpInterceptor {

  isTokenRefreshing = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private auth$: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.indexOf('refresh') !== -1 || req.url.indexOf('login') !== -1) {
      return next.handle(req);
    }

    const authenticationToken = this.auth$.getToken();

    if (authenticationToken) {
      return next.handle(this.addToken(req, authenticationToken))
        .pipe(catchError(error => {
          if (error instanceof HttpErrorResponse
            && error.status === 403) {
            return this.handleAuthErrors(req, next);
          } else {
            return throwError(error);
          }
        }));
    }
    return next.handle(req);

  }

  private handleAuthErrors(req: HttpRequest<any>, next: HttpHandler)
    : Observable<HttpEvent<any>> {

    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.auth$.refreshAuthToken().pipe(
        switchMap((refreshTokenResponse: LoginResponse) => {
          this.isTokenRefreshing = false;
          this.refreshTokenSubject.next(refreshTokenResponse.token);
          return next.handle(this.addToken(req, refreshTokenResponse.token));
        })
      );
    }
    else {
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap(_ => {
          return next.handle(this.addToken(req, this.auth$.getToken()))
        })
      );
    }
  }

  addToken(req: HttpRequest<any>, authenticationToken: any) {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authenticationToken}`)
    });
  }

}