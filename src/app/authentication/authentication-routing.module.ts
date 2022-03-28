import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {LoginGuard} from "./login/login.guard";
import {Oauth2CallbackComponent} from "./oauth2-callback/oauth2-callback.component";

const routes: Routes = [
  // { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  // { path: 'register', component: LoginComponent },
  // { path: 'oauth2/callback', component: Oauth2CallbackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
