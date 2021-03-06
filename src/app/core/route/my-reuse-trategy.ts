import {ComponentRef} from "@angular/core";
import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from "@angular/router";
import {MessageService} from "../../shared/services/message.service";

interface RouteHandleStorage {
  snapshot: ActivatedRouteSnapshot;
  handle: DetachedRouteHandleExt | null;
}

interface DetachedRouteHandleExt extends DetachedRouteHandle {
  componentRef: ComponentRef<any>;
}

export class MyReuseStrategy implements RouteReuseStrategy {
  constructor(
    private messageService: MessageService
  ) {
  }

  storedRoutes: { [key: string]: RouteHandleStorage } = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandleExt | null): void {
    let storedRoute = {
      snapshot: route,
      handle: handle,
    }

    if (!handle) return;
    MyReuseStrategy.callHook(handle, 'onDetach');
    this.storedRoutes[this.getKey(route)] = storedRoute;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const storedRoute = this.storedRoutes[this.getKey(route)];
    let canAttach = !!route.routeConfig && !!storedRoute;

    if (canAttach) {
      const paramsMatch = this.compare(route.params, storedRoute.snapshot.params);
      const queryParamsMatch = this.compare(route.queryParams, storedRoute.snapshot.queryParams);
      const shouldAttach = paramsMatch && queryParamsMatch;
      shouldAttach && MyReuseStrategy.callHook(storedRoute.handle, 'onAttach');
      return shouldAttach
    }
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig || !this.storedRoutes[this.getKey(route)]) return null;
    return this.storedRoutes[this.getKey(route)].handle;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    const should =
      (future.routeConfig === curr.routeConfig && this.compare(future.params, curr.params)) ||
      future.data.reuse;


    should && this.messageService.routeReuse$.next(future);
    return should;
  }

  private compare(base: any, compare: any): boolean {
    for (let baseProperty in base) {
      if (compare.hasOwnProperty(baseProperty)) {
        switch (typeof base[baseProperty]) {
          case 'object':
            if (typeof compare[baseProperty] !== 'object'
              || !this.compare(base[baseProperty], compare[baseProperty])) {
              return false;
            }
            break;
          case 'function':
            if (typeof compare[baseProperty] !== 'function'
              || base[baseProperty].toString() !== compare[baseProperty].toString()) {
              return false;
            }
            break;
          default:
            if (base[baseProperty] != compare[baseProperty]) {
              return false
            }
        }
      } else {
        return false;
      }
    }
    return true;
  }

  private getKey(route: ActivatedRouteSnapshot): string {
    let path = '';

    path +=
      route.pathFromRoot
        .map(route => route.routeConfig?.path as string
          + route.routeConfig?.component?.name as string
          + JSON.stringify(route.params))
        .join("->");

    const firstChild = route.firstChild;
    path +=
      ' ## '
      + firstChild?.routeConfig?.path as string
      + firstChild?.routeConfig?.component?.name as string
      + JSON.stringify(route.params);

    return path;
  }

  private static callHook(detachedTree: DetachedRouteHandleExt | null, hookName: string) {
    const componentRef = detachedTree?.componentRef;
    if (
      componentRef &&
      componentRef.instance &&
      typeof componentRef.instance[hookName] === 'function'
    ) {
      componentRef.instance[hookName]();
    }
  }
}
