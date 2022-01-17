import { JsonpClientBackend } from "@angular/common/http";
import { ComponentRef } from "@angular/core";
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";
import { withLatestFrom } from "rxjs/operators";
import { MessageService } from "./components/common/message.service";
import { FriendListComponent } from "./components/profile/friend-list/friend-list.component";

interface RouteStorageObject {
	snapshot: ActivatedRouteSnapshot;
	handle: DetachedRouteHandleExt | null;
}

interface DetachedRouteHandleExt extends DetachedRouteHandle {
	componentRef: ComponentRef<any>;
}

interface RouteCacheRecord {
	handle: DetachedRouteHandleExt;
/**
* For unclear reasons, when the navigation starts, "retrieve" is called
* without calling "shouldAttach" first (from "createRouterState").
* This flag is used to ignore those calls. :-
* */
	shouldAttachCalled: boolean;
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
			handle: handle
		}

		if (!handle) return;

		this.callHook(handle, 'onDetach');

		console.groupCollapsed('========= STORE ============');
		console.log('Stored route: ', storedRoute, "\npath: ", this.getKey(route));
		
		
		console.groupEnd();
		this.storedRoutes[this.getKey(route)] = storedRoute;
	}

	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		// return false;
		let canAttach: boolean = !!route.routeConfig 
			&& !!this.storedRoutes[this.getKey(route)];

		if (canAttach) {
			console.groupCollapsed('========= ATTACH ===========')
			console.log('param comparison:');
			let storedRoute = this.storedRoutes[this.getKey(route)];
			console.log(this.compareObjects(route.params, 
				this.storedRoutes[this.getKey(route)].snapshot.params));
			console.log('query param comparison');
			console.log(this.compareObjects(route.queryParams, 
				this.storedRoutes[this.getKey(route)].snapshot.queryParams));

			let paramsMatch: boolean = this.compareObjects(route.params, 
				this.storedRoutes[this.getKey(route)].snapshot.params);
			let queryParamsMatch: boolean = this.compareObjects(route.queryParams, 
				this.storedRoutes[this.getKey(route)].snapshot.queryParams);
			console.groupEnd();

			if (paramsMatch && queryParamsMatch) {
				console.log(route, this.storedRoutes[this.getKey(route)].snapshot);
			}

			let shouldAttach =  paramsMatch && queryParamsMatch;
			if (shouldAttach) {
				this.callHook(storedRoute.handle, 'onAttach');
			}
			return shouldAttach
		}
		return false;
	}

	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
		// return null if the path does not have a routerConfig OR if there is no stored route for that routerConfig
		if (!route.routeConfig || !this.storedRoutes[this.getKey(route)]) return null;
		console.log(" retrieving", this.getKey(route), this.storedRoutes[this.getKey(route)]);
		// if (route.routeConfig.loadChildren) return null;

		/** returns handle when the route.routeConfig.path is already stored */
		return this.storedRoutes[this.getKey(route)].handle;
	}

	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		let should = (future.routeConfig === curr.routeConfig 
			&& this.compareObjects(future.params, curr.params)); 
		return should;
	}

	private compareObjects(base: any, compare: any): boolean {

		for (let baseProperty in base) {

			if (compare.hasOwnProperty(baseProperty)) {
				switch (typeof base[baseProperty]) {
					case 'object':
						if (typeof compare[baseProperty] !== 'object' 
							|| !this.compareObjects(base[baseProperty], compare[baseProperty])) { 
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

		path += this.getPath(route);
		path += this.getChildrenPath(route);
		// path += route.routeConfig?.component?.name;
		// while (route.parent) {
		// 	route = route.parent as ActivatedRouteSnapshot;
		// 	path += route.routeConfig?.path as string + JSON.stringify(route.params) ; 
		// }

		return path;
	}

	private callHook(detachedTree: DetachedRouteHandleExt | null, hookName: string): void {
    const componentRef = detachedTree?.componentRef;
    if (
        componentRef &&
        componentRef.instance &&
        typeof componentRef.instance[hookName] === 'function'
    ) {
				console.log('call hoollslsl');
				
        componentRef.instance[hookName]();
    }
	}

	private getPath(route: ActivatedRouteSnapshot): string {
		return route.pathFromRoot
		.map(route => route.routeConfig?.path as string + route.routeConfig?.component?.name + JSON.stringify(route.params))
		.join("->");
	}

	private getChildrenPath(route: ActivatedRouteSnapshot): string {
		let path = '';


		// while (route.children) {
			route.children.forEach(child => {
				path += child.routeConfig?.path as string + route.routeConfig?.component?.name + JSON.stringify(route.params);
			});
		// }
		

		return path;
	}
}
