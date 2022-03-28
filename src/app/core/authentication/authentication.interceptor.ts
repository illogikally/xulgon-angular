import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {LoginResponse} from '../../authentication/login/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationInterceptor implements HttpInterceptor {

  private isTokenRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private auth$: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if ((/login|oauth2|authentication/.test(req.url))) {
      return next.handle(req);
    }

    const authenticationToken = this.auth$.getToken();

    if (authenticationToken) {
    const expiresAt = this.auth$.getExpiresAt();
    const current = new Date().getTime();

    if (expiresAt - current < 1e4) {
        return this.handleAuthErrors(req, next);
      }

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

  private handleAuthErrors(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.auth$.refreshAuthToken().pipe(
        switchMap((refreshTokenResponse: LoginResponse) => {
          this.isTokenRefreshing = false;
          this.refreshTokenSubject.next(refreshTokenResponse.token);
          this.auth$.storeResponse(refreshTokenResponse);
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

  private addToken(req: HttpRequest<any>, authenticationToken: any) {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authenticationToken}`)
    });
  }

}
