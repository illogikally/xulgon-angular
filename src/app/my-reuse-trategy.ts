import { Route } from "@angular/compiler/src/core";
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";
import { ProfileComponent } from "./components/profile/profile.component";

interface RouteStorageObject {
	snapshot: ActivatedRouteSnapshot;
	handle: DetachedRouteHandle | null;
}
export class MyReuseStrategy implements RouteReuseStrategy {
	storedRoutes: { [key: string]: RouteStorageObject } = {};

	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		return true;
		// if (route.routeConfig?.component?.name === 'ProfileComponent') {
		// 	console.log('shouldDetach');
		// 	return true;
			
		// }
		// console.log('not detach');
		
		// return false;
	}

	store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
		let storedRoute: RouteStorageObject = {
			snapshot: route,
			handle: handle
		}
		console.log('storedRoute: ', storedRoute, "path: ", this.getKey(route));
		
		this.storedRoutes[this.getKey(route)] = storedRoute;
	}

	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		let canAttach: boolean = !!route.routeConfig && !!this.storedRoutes[this.getKey(route)];

		if (canAttach) {
			let willAttach: boolean = true;
				console.log("param comparison:");
				console.log(this.compareObjects(route.params, this.storedRoutes[this.getKey(route)].snapshot.params));
				console.log("query param comparison");
				console.log(this.compareObjects(route.queryParams, this.storedRoutes[this.getKey(route)].snapshot.queryParams));

				let paramsMatch: boolean = this.compareObjects(route.params, this.storedRoutes[this.getKey(route)].snapshot.params);
				let queryParamsMatch: boolean = this.compareObjects(route.queryParams, this.storedRoutes[this.getKey(route)].snapshot.queryParams);

				console.table([route, this.storedRoutes[this.getKey(route)]]);
				// console.log("deciding to attach...", route, "does it match?", this.storedRoutes[this.getKey(route)].snapshot, "return: ", paramsMatch && queryParamsMatch);
				return paramsMatch && queryParamsMatch;
		} else {
				return false;
		}
	}

	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
		        // return null if the path does not have a routerConfig OR if there is no stored route for that routerConfig
        if (!route.routeConfig || !this.storedRoutes[this.getKey(route)]) return null;
        console.log("retrieving", "return: ", this.storedRoutes[this.getKey(route)]);

        /** returns handle when the route.routeConfig.path is already stored */
        return this.storedRoutes[this.getKey(route)].handle;
	}

	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		// console.log("deciding to reuse", "future", future, "current", curr.routeConfig, "return: ");
		console.log("actroutesnap: fugre", future.routeConfig, " curresnt ", curr.routeConfig);

		let should =  (future.routeConfig === curr.routeConfig && !(curr.routeConfig?.component?.name === 'ProfileComponent'));
		console.log(should);
		
		return should;
	}

	private compareObjects(base: any, compare: any): boolean {

		// loop through all properties in base object
		for (let baseProperty in base) {

			// determine if comparrison object has that property, if not: return false
			if (compare.hasOwnProperty(baseProperty)) {
				switch (typeof base[baseProperty]) {
					// if one is object and other is not: return false
					// if they are both objects, recursively call this comparison function
					case 'object':
						if (typeof compare[baseProperty] !== 'object' || !this.compareObjects(base[baseProperty], compare[baseProperty])) { return false; } break;
					// if one is function and other is not: return false
					// if both are functions, compare function.toString() results
					case 'function':
						if (typeof compare[baseProperty] !== 'function' || base[baseProperty].toString() !== compare[baseProperty].toString()) { return false; } break;
					// otherwise, see if they are equal using coercive comparison
					default:
						if (base[baseProperty] != compare[baseProperty]) { return false }
				}
			} else {
				return false;
			}
		}

		// returns true only after false HAS NOT BEEN returned through all loops
		return true;
	}

	private getKey(route: ActivatedRouteSnapshot): string {
		let path = route.routeConfig?.path as string + JSON.stringify(route.params) ;
		return path;
	}
}
