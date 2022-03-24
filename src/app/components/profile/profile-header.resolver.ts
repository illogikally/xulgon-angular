import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ProfileService} from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileHeaderResolver implements Resolve<boolean> {
  constructor(private profile$: ProfileService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<any> {
      let profileId = Number(route.paramMap.get('id'));
      if (profileId) {
        return this.profile$.getProfileHeader(profileId).pipe(
          catchError(() => of(null))
        )
      }
      return of(null);
  }
}
