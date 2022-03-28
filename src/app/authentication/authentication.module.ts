import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthenticationRoutingModule} from './authentication-routing.module';
import {LoginComponent} from "./login/login.component";
import {Oauth2CallbackComponent} from "./oauth2-callback/oauth2-callback.component";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {ClickOutsideModule} from "ng-click-outside";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    Oauth2CallbackComponent,
    LoginComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    ClickOutsideModule,
    ReactiveFormsModule,
    CommonModule,
    AuthenticationRoutingModule
  ]
})
export class AuthenticationModule { }
