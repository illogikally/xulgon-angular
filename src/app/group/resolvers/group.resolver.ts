import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {GroupService} from "../group.service";
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GroupResolver implements Resolve<boolean> {
  constructor(
    private groupService: GroupService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const groupId = Number(route.paramMap.get('id'));
    if (!isNaN(groupId)) {
      const savedGroup = this.groupService.loadedGroups.get(groupId);
      if (savedGroup) {
        return of(savedGroup);
      }
      return this.groupService.getGroupHeader(groupId).pipe(
        tap(group => this.groupService.loadedGroups.set(groupId, group)),
        catchError(() => of(null)),
      )
    }
    return of(null);
  }
}
