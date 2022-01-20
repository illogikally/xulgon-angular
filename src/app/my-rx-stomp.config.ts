import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { RxStomp } from '@stomp/rx-stomp';
// import * as SockJS from 'sockjs-client';
import { AuthenticationService } from './components/authentication/authentication.service';



export class MyRxStompConfig extends InjectableRxStompConfig {
  constructor(private auth$: AuthenticationService) {
    super();
    // this.webSocketFactory = () => new SockJS('http://localhost:8080/ws');
    this.webSocketFactory = () => new WebSocket('ws://localhost:8080/ws/websocket');
    // this.connectHeaders = {
    //   'X-Authorization': this.auth$.getWebsocketToken()
    // },
    this.beforeConnect = async (rxStomp: RxStomp) => {
      rxStomp.configure({
        connectHeaders: {
          'X-Authorization': await this.auth$.fetchToken()
        }
      });
    }

    this.heartbeatIncoming = 0;
    this.heartbeatOutgoing = 20000;
    this.reconnectDelay = 200;
    // this.debug = (msg: string) => {
    //   console.log(new Date(), msg);
    // }
  }
}