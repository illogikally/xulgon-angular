import {Injectable} from '@angular/core';
import {Route, Routes} from "@angular/router";
import {LoggedInComponent} from "./logged-in.component";
import {AuthenticationGuard} from "../core/authentication/authentication.guard";

@Injectable({
  providedIn: 'root'
})
export class LoggedInService {

  constructor() { }

  static withLoggedIn(routes: Routes): Route {
    return {
      path: '',
      component: LoggedInComponent,
      children: routes,
      canActivate: [AuthenticationGuard],
      data: { reuse: true }
    }
  }
}
