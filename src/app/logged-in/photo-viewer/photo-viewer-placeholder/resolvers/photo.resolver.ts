import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PhotoService } from 'src/app/shared/components/photo/photo.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoResolver implements Resolve<boolean> {
  constructor(
    private photoService: PhotoService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const photoId = Number(route.paramMap.get('id'));
    const setId = Number(route.queryParamMap.get('set'));
    if (!isNaN(photoId)) {
      const getter = 
        isNaN(setId) || setId <= 0 
        ? this.photoService.getPhoto(photoId)
        : this.photoService.getPhotoBySetIdAndPhotoId(setId, photoId);
      return getter.pipe(catchError(() => of(null)));
    }
    return of(null);
  }
}
