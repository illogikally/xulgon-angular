import { tokenize } from '@angular/compiler/src/ml_parser/lexer';
import { Inject, Injectable, Injector } from '@angular/core';
import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import * as SockJS from 'sockjs-client';
import { AuthenticationService } from './components/authentication/authentication.service';



export class MyRxStompConfig extends InjectableRxStompConfig {
  constructor(private auth$: AuthenticationService) {
    super();
    this.webSocketFactory = () => new SockJS('http://localhost:8080/ws');
    this.connectHeaders = {
      'X-Authorization': this.auth$.getToken()
    },
    this.heartbeatIncoming = 0;
    this.heartbeatOutgoing = 20000;
    this.reconnectDelay = 500;
    // this.debug = (msg: string) => {
    //   console.log(new Date(), msg);
    // }
  }
}