import { JsonpClientBackend } from "@angular/common/http";
import { ComponentRef } from "@angular/core";
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";
import { withLatestFrom } from "rxjs/operators";
import { MessageService } from "./components/share/message.service";
import { FriendListComponent } from "./components/profile/friend-list/friend-list.component";

interface RouteStorageObject {
	snapshot: ActivatedRouteSnapshot;
	handle: DetachedRouteHandleExt | null;
}

interface DetachedRouteHandleExt extends DetachedRouteHandle {
	componentRef: ComponentRef<any>;
}

export class MyReuseStrategy implements RouteReuseStrategy {
	storedRoutes: { [key: string]: RouteStorageObject } = {};

	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		if (!route.routeConfig) {
			return false;
		}
		return true;
	}

	store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandleExt | null): void {
		let storedRoute: RouteStorageObject = {
			snapshot: route,
			handle: handle,
		}

		if (!handle) return;

		this.callHook(handle, 'onDetach');
		this.storedRoutes[this.getKey(route)] = storedRoute;
	}

	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		const storedRoute = this.storedRoutes[this.getKey(route)];

		let canAttach: boolean = !!route.routeConfig
			&& !!storedRoute;

		if (canAttach) {
			const paramsMatch = this.compare(route.params, storedRoute.snapshot.params);
			const queryParamsMatch = this.compare(route.queryParams, storedRoute.snapshot.queryParams);


			const shouldAttach =  paramsMatch && queryParamsMatch;

			if (shouldAttach) {
				this.callHook(storedRoute.handle, 'onAttach');
				
			} else {
			}
			return shouldAttach
		}
		return false;
	}

	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
		if (!route.routeConfig || !this.storedRoutes[this.getKey(route)]) return null;
		return this.storedRoutes[this.getKey(route)].handle;
	}

	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		let should = (future.routeConfig === curr.routeConfig
			&& this.compare(future.params, curr.params)
		)
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
						if (base[baseProperty] != compare[baseProperty]) { return false }
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

	private callHook(detachedTree: DetachedRouteHandleExt | null, hookName: string): void {
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
