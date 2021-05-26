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

    constructor(private authenticationService: AuthenticationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (req.url.indexOf('refresh') !== -1 || req.url.indexOf('retrieve') !== -1) {
            return next.handle(req);
        }
        const authenticationToken = this.authenticationService.getAuthenticationToken();

        if (authenticationToken) {
            return next.handle(this.addToken(req, authenticationToken));
            // .pipe(catchError(error => {
            //     if (error instanceof HttpErrorResponse
            //         && error.status === 403) {
            //         return this.handleAuthErrors(req, next);
            //     } else {
            //         return throwError(error);
            //     }
            // }));
        }
        return next.handle(req);

    }

    // private handleAuthErrors(req: HttpRequest<any>, next: HttpHandler)
    //     : Observable<HttpEvent<any>> {
    //     if (!this.isTokenRefreshing) {
    //         this.isTokenRefreshing = true;
    //         this.refreshTokenSubject.next(null);

    //         return this.authenticationService.refreshToken().pipe(
    //             switchMap((refreshTokenResponse: LoginResponse) => {
    //                 this.isTokenRefreshing = false;
    //                 this.refreshTokenSubject
    //                     .next(refreshTokenResponse.authenticationToken);
    //                 return next.handle(this.addToken(req,
    //                     refreshTokenResponse.authenticationToken));
    //             })
    //         )
    //     } else {
    //         return this.refreshTokenSubject.pipe(
    //             filter(result => result !== null),
    //             take(1),
    //             switchMap((res) => {
    //                 return next.handle(this.addToken(req,
    //                     this.authService.getJwtToken()))
    //             })
    //         );
    //     }
    // }

    addToken(req: HttpRequest<any>, authenticationToken: any) {
        return req.clone({
            headers: req.headers.set('Authorization',
                'Bearer ' + authenticationToken)
        });
    }

}