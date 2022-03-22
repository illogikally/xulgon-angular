import { Component, ElementRef, EventEmitter, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { AuthenticationService } from '../../authentication/authentication.service';
import { TitleService } from '../../share/title.service';
import { UserService } from '../../share/user.service';
import { ChatMessage } from '../chat-msg';
import { ChatService } from '../chat.service';
import { ConversationNotif } from '../conversation-notif';

@Component({
  selector: 'app-chat-notification',
  templateUrl: './chat-notification.component.html',
  styleUrls: ['./chat-notification.component.scss']
})
export class ChatNotificationComponent implements OnInit {

  unreadCount = 0;
  unreadNotificationCount = 0;
  latestConversations: ConversationNotif[] = [];
  isPopupVisible = false;
  conversationRead = new EventEmitter<number>();


  @ViewChild('popup', {static: true}) popup!: ElementRef;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private authenticationService: AuthenticationService,
    private rxStompService: RxStompService,
    private titleService: TitleService,
    private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.loadConversations();

    this.conversationRead.subscribe(messageId => {
      this.unreadCount--;
      this.markAsRead(messageId);
      this.titleService.modifyNotificationCount(-1);
    });

    this.chatService.getUnreadCount().subscribe(count => {
      this.unreadCount = count;
      this.titleService.modifyNotificationCount(count);
    });

    this.rxStompService.watch('/user/queue/chat').subscribe(msg => {
      let chatMsg: ChatMessage = JSON.parse(msg.body);
      let conversation = this.latestConversations.find(conv => conv.id == chatMsg.conversationId)
      if (conversation) {
        if (chatMsg.user.id !== this.authenticationService.getPrincipalId()
          && (conversation.latestMessage.user.id !== chatMsg.user.id
            || conversation.latestMessage.isRead === true)) {
          this.unreadCount++;
          this.titleService.modifyNotificationCount(1);
        }
        conversation.latestMessage = chatMsg;
      }
      else {
        this.latestConversations.unshift({
          id: chatMsg.conversationId,
          user: chatMsg.user,
          latestMessage: chatMsg
        });
        this.unreadCount++;
        this.titleService.modifyNotificationCount(1);
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
    this.isPopupVisible = !this.isPopupVisible;
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
