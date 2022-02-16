import {HttpClient} from '@angular/common/http';
import {Component, ElementRef, EventEmitter, Input, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MessageService} from '../../share/message.service';
import { ChatService } from '../../service/chat.service';
import {ChatMessage} from '../chat-msg';
import { RxStompService } from '@stomp/ng2-stompjs';
import { UserBasic } from '../../share/user-basic';
import { Router } from '@angular/router';

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

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    private authService: AuthenticationService,
    private router: Router,
    private renderer: Renderer2,
    private self: ElementRef,
    private rxStomp: RxStompService,
  ) {
    this.msgForm = new FormGroup({
      input: new FormControl('')
    });
  }

  navigateToUserProfile() {
    this.router.navigateByUrl(`/${this.user.profileId}`)
  }

  ngOnInit(): void {
    this.messageService.openChatBox$.subscribe(user => {
      if (user.id != this.user?.id) {
        this.user = user;
        this.loadMessages();
      }
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
    this.renderer.setStyle(
      this.self.nativeElement.children[0],
      'display',
      'none'
    );
  }

  show(): void {
    this.renderer.setStyle(
      this.self.nativeElement.children[0],
      'display',
      'block'
    );
  }

  loadMessages(): void {
    this.messages = [];
    this.chatService.getMesssages(this.user.id).subscribe(resp => {
      this.messages = resp;
      this.markConversationAsRead();
    });
  }

  getConversationId(): number | undefined {
    return this.messages.find(msg => msg.conversationId)?.conversationId;
  }

  markConversationAsRead(): void {
    if (
      !this.messages[0]
      || this.messages[0].isRead == true
      || this.messages[0].userId == this.authService.getPrincipalId()
    ) {
      return;
    }
    this.messages[0].isRead = true;
    this.markAsRead.emit(this.messages[0].id);
  }

  sendMessage(): void {
    if (this.msgForm.get('input')!.value == '') {
      return;
    }

    let messageRequest = {
      message: this.msgForm.get('input')!.value,
      receiverId: this.user.id,
      conversationId: this.getConversationId()
    }

    this.msgForm.get('input')!.setValue('');

    this.rxStomp.publish({
      destination: '/app/chat',
      body: JSON.stringify(messageRequest)
    });
  }

  chatboxClick(): void {
    this.markConversationAsRead();
  }
}
