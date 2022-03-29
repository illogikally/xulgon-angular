import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InjectableRxStompRpcConfig, RxStompService, rxStompServiceFactory} from "@stomp/ng2-stompjs";
import {MyRxStompConfig} from "./websocket/my-rx-stomp.config";
import {AuthenticationService} from "./authentication/authentication.service";
import {RouteReuseStrategy} from "@angular/router";
import {MyReuseStrategy} from "./route/my-reuse-trategy";
import {MessageService} from "../shared/services/message.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthenticationInterceptor} from "./authentication/authentication.interceptor";
import {CustomPreloadingStrategy} from "./route/custom-preloading-strategy";


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: InjectableRxStompRpcConfig,
      useClass: MyRxStompConfig,
      deps: [AuthenticationService]
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompRpcConfig]
    },
    {
      provide: RouteReuseStrategy,
      useClass: MyReuseStrategy,
      deps: [MessageService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    {
      provide: CustomPreloadingStrategy,
    }
  ]
})
export class CoreModule { }
