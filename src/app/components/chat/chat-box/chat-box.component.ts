import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RxStompService } from '@stomp/ng2-stompjs';
import { RxStomp } from '@stomp/rx-stomp';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {

  messages!: any[];
  msgForm: FormGroup;

  constructor(private authService: AuthenticationService,
    private rxStomp: RxStompService,
    private http: HttpClient) {
    
    this.msgForm = new FormGroup({
      input: new FormControl('')
    });
    
  }

  ngOnInit(): void {
    this.http.get<any>(`http://localhost:8080/api/messages/with/2`).subscribe(resp => {
      this.messages = resp;
    })
    this.rxStomp.watch('/user/queue/chat').subscribe(msg => {
      console.log(msg);
    });

  }

  submit(): void {
    let messageRequest = {
      message: this.msgForm.get('input')?.value,
      receiverId: 2
    }

    this.rxStomp.publish({
      destination: '/app/chat', 
      body: JSON.stringify(messageRequest)
    });

  }
}
