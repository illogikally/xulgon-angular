import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RxStompService } from '@stomp/ng2-stompjs';
import { RxStomp } from '@stomp/rx-stomp';
import { AuthenticationService } from '../../authentication/authentication.service';
import { MessageService } from '../../common/message.service';
import { ChatMessage } from '../chat-msg';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {

  messages!: ChatMessage[];
  msgForm: FormGroup;
  visible = false;
  user!: any;
  @Input() markAsRead!: EventEmitter<number>;

  constructor(private message$: MessageService,
    private auth$: AuthenticationService,
    private renderer: Renderer2,
    private self: ElementRef,
    private rxStomp: RxStompService,
    private http: HttpClient) {
    
    this.msgForm = new FormGroup({
      input: new FormControl('')
    });
    
  }

  ngOnInit(): void {
    this.message$.openChatBox.subscribe(user => {
      this.user = user;
      this.loadMessages();
      this.show();
    });

    this.markAsRead
    this.rxStomp.watch('/user/queue/chat').subscribe(msg => {
      let chatMsg: ChatMessage = JSON.parse(msg.body);
      if (this.messages) {
        this.messages.unshift(chatMsg);
      }
    });

  }

  close(): void {
    this.renderer.setStyle(this.self.nativeElement.children[0], 'display', 'none');
  }

  show(): void {
    this.renderer.setStyle(this.self.nativeElement.children[0], 'display', 'block');
  }

  loadMessages(): void {
    this.messages = [];

    this.http.get<any>(`http://localhost:8080/api/messages/with/${this.user.id}`).subscribe(resp => {
      this.messages = resp;
      this.markConversationAsRead();
    })
  }

  getConversationId(): number | undefined {
    return this.messages.find(msg => msg.conversationId)?.conversationId;
  }

  markConversationAsRead(): void {
    if (this.messages[0]?.isRead === true || this.messages[0]?.userId === this.auth$.getUserId()) return;
    this.messages[0].isRead = true;
    console.log('mark as read');
    
    this.markAsRead.emit(this.messages[0].id);
  }

  sendMessage(): void {
    let messageRequest = {
      message: this.msgForm.get('input')?.value,
      receiverId: this.user.id,
      conversationId: this.getConversationId()
    }

    this.msgForm.get('input')?.setValue('');

    this.rxStomp.publish({
      destination: '/app/chat', 
      body: JSON.stringify(messageRequest)
    });
  }

  chatboxClick(): void {
    this.markConversationAsRead();
  }
}
