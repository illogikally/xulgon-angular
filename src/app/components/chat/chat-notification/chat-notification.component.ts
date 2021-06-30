import { Component, ElementRef, EventEmitter, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ChatService } from '../../service/chat.service';
import { ChatMessage } from '../chat-msg';
import { ConversationNotif } from '../conversation-notif';

@Component({
  selector: 'app-chat-notification',
  templateUrl: './chat-notification.component.html',
  styleUrls: ['./chat-notification.component.scss']
})
export class ChatNotificationComponent implements OnInit {

  unreadCount!: any;
  latestConversations = new Array<ConversationNotif>();
  
  conversationRead = new EventEmitter<number>();


  @ViewChild('popup', {static: true}) popup!: ElementRef;
  constructor(private chatService: ChatService,
    private auth$: AuthenticationService,
    private rxStomp$: RxStompService,
    private renderer: Renderer2) { }

  ngOnInit(): void {
    this.loadConversations();

    this.conversationRead.subscribe(messageId => {
      this.unreadCount--;
      this.markAsRead(messageId);
    });

    this.chatService.getUnreadCount().subscribe(count => {
      this.unreadCount = count;
    });

    this.rxStomp$.watch('/user/queue/chat').subscribe(msg => {
      let chatMsg: ChatMessage = JSON.parse(msg.body);
      let conversation = this.latestConversations.find(conv => conv.id == chatMsg.conversationId)
      if (conversation) {

        if (conversation.latestMessage.isRead === true 
          && conversation.latestMessage.id != this.auth$.getUserId()) {
          this.unreadCount++;
        }
        conversation.latestMessage = chatMsg;
      }
    }); 

  }

  loadConversations(): void {
    this.chatService.getLatest().subscribe(latest => { 
      this.latestConversations = this.latestConversations.concat(latest);
    })
  }

  hidePopup(): void {
    this.renderer.setStyle(this.popup.nativeElement, 'display', 'none');
  }

  togglePopup(): void {

    // if (!this.latestConversations.length) this.loadConversations();
    this.renderer.setStyle(this.popup.nativeElement, 'display', this.popup.nativeElement.style.display == 'block' ? 'none' : 'block');
  }

  markAsRead(messageId: number): void {
    this.chatService.markAsRead(messageId).subscribe(_ => {
      let conversation = this.latestConversations.find(conv => conv.latestMessage.id == messageId);
      if (conversation) {
        conversation.latestMessage.isRead = true;
      }
    });
  }


}
