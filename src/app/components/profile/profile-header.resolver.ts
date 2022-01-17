import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProfileService } from './profile.service';

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
      return this.profile$.getProfileHeader(profileId)
  }
}
