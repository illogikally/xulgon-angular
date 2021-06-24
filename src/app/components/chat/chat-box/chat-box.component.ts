import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RxStompService } from '@stomp/ng2-stompjs';
import { RxStomp } from '@stomp/rx-stomp';
import { AuthenticationService } from '../../authentication/authentication.service';
import { MessageService } from '../../common/message.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {

  messages!: any[];
  msgForm: FormGroup;
  userId!: number;
  visible = false;
  user!: any;

  constructor(private messageService: MessageService,
    private renderer: Renderer2,
    private self: ElementRef,
    private rxStomp: RxStompService,
    private http: HttpClient) {
    
    this.msgForm = new FormGroup({
      input: new FormControl('')
    });
    
  }

  ngOnInit(): void {
    this.messageService.openChatBox.subscribe(user => {
      
      this.userId = user.id;
      this.user = user;
      console.log(this.self.nativeElement);
      
      this.loadMessages();
      this.show();
      
    });

    this.rxStomp.watch('/user/queue/chat').subscribe(msg => {
      this.messages.unshift(JSON.parse(msg.body));
    });

  }

  close(): void {
    this.renderer.setStyle(this.self.nativeElement.children[0], 'visibility', 'hidden');
  }

  show(): void {
    this.renderer.setStyle(this.self.nativeElement.children[0], 'visibility', 'visible');
  }

  loadMessages(): void {

    this.http.get<any>(`http://localhost:8080/api/messages/with/${this.user.id}`).subscribe(resp => {
      this.messages = resp;
    })
  }

  submit(): void {
    let messageRequest = {
      message: this.msgForm.get('input')?.value,
      receiverId: this.userId
    }

    this.msgForm.get('input')?.setValue('');

    this.rxStomp.publish({
      destination: '/app/chat', 
      body: JSON.stringify(messageRequest)
    });

  }
}
