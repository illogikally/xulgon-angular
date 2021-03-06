import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {GroupService} from './group.service';

@Injectable({
  providedIn: 'root'
})
export class GroupAdminGuard implements CanActivate {
  constructor(
    private groupService: GroupService,
    private router: Router,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const groupId = Number(route.parent?.paramMap.get('id'));
    if (!isNaN(groupId)) {
      const savedGroup = this.groupService.loadedGroups.get(groupId);
      if (savedGroup) {
        if (savedGroup.role != 'ADMIN') {
          this.router.navigateByUrl('');
        }
        return of(true);
      }
      else return this.groupService.getRole(groupId).pipe(
        catchError(() => of(false)),
        map(role => {
          if (!(role == 'ADMIN')) {
            this.router.navigateByUrl('');
          }
          return true;
        })
      );
    }
    return of(false);
  }

}
