import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { RxStomp } from '@stomp/rx-stomp';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './components/authentication/authentication.service';



export class MyRxStompConfig extends InjectableRxStompConfig {
  constructor(
    private authenticationService: AuthenticationService
  ) {
    super();
    this.webSocketFactory = () => new WebSocket(`ws://${environment.hostname}/ws/websocket`);
    this.beforeConnect = async (rxStomp: RxStomp) => {
      rxStomp.configure({
        connectHeaders: {
          'X-Authorization': await this.authenticationService.fetchToken()
        }
      });
    }

    this.heartbeatIncoming = 0;
    this.heartbeatOutgoing = 20000;
    this.reconnectDelay = 500;
    // this.debug = (msg: string) => {
    //   console.log(new Date(), msg);
    // }
  }
}