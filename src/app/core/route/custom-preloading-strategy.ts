import {Injectable} from "@angular/core";
import {PreloadingStrategy, Route} from "@angular/router";
import {Observable, of, timer} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    if (route.data && route.data.preload) {
      const delay = Number(route.data.delay) || 0;
      return timer(delay).pipe(map(() => {
        return fn();
      }));
    }
    return of(null);
  }

}
