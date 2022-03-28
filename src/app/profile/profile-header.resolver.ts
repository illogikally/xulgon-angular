import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {ProfileService} from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileHeaderResolver implements Resolve<boolean> {
  constructor(
    private profileService: ProfileService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    let profileId = Number(route.paramMap.get('id'));
    if (!isNaN(profileId)) {
      const savedProfile = this.profileService.loadedProfileIds.get(profileId);
      if (savedProfile) {
        return of(savedProfile);
      }
      return this.profileService.getProfileHeader(profileId).pipe(
        catchError(() => of(null)),
        tap(profile => this.profileService.loadedProfileIds.set(profileId, profile))

      )
    }
    return of(null);
  }
}
