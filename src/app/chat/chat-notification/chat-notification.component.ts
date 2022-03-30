import {Component, ElementRef, EventEmitter, OnInit, Renderer2, ViewChild} from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {AuthenticationService} from '../../core/authentication/authentication.service';
import {TitleService} from '../../shared/services/title.service';
import {ChatMessage} from '../chat-box/chat-msg/chat-msg';
import {ChatService} from '../chat.service';
import {ConversationNotif} from './conversation-notif';

@Component({
  selector: 'app-chat-notification',
  templateUrl: './chat-notification.component.html',
  styleUrls: ['./chat-notification.component.scss']
})
export class ChatNotificationComponent implements OnInit {

  unreadCount = 0;
  unreadNotificationCount = 0;
  conversations: ConversationNotif[] = [];
  isPopupVisible = false;
  conversationRead = new EventEmitter<number>();


  @ViewChild('popup', {static: true}) popup!: ElementRef;

  constructor(
    private chatService: ChatService,
    private authenticationService: AuthenticationService,
    private rxStompService: RxStompService,
    private titleService: TitleService,
    private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.getUnreadCount();
    this.loadConversations();

    this.conversationRead.subscribe(messageId => {
      this.unreadCount--;
      this.markAsRead(messageId);
      this.titleService.modifyNotificationCount(-1);
    });

    this.listenOnNewChatMessage();
  }

  getUnreadCount() {
    this.chatService.getUnreadCount().subscribe(count => {
      this.unreadCount = count;
      this.titleService.modifyNotificationCount(count);
    });
  }

  listenOnNewChatMessage() {
    this.rxStompService.watch('/user/queue/chat').subscribe(msg => {
      let chatMsg: ChatMessage = JSON.parse(msg.body);
      let conversation = this.conversations.find(conv => conv.id == chatMsg.conversationId)
      if (conversation) {
        if (chatMsg.user.id !== this.authenticationService.getPrincipalId()
          && (conversation.latestMessage.user.id !== chatMsg.user.id
            || conversation.latestMessage.isRead === true)) {
          this.unreadCount++;
          this.titleService.modifyNotificationCount(1);
        }
        conversation.latestMessage = chatMsg;
        this.hoistUnread();
      }
      else {
        this.conversations.unshift({
          id: chatMsg.conversationId,
          user: chatMsg.user,
          latestMessage: chatMsg
        });
        this.unreadCount++;
        this.titleService.modifyNotificationCount(1);
      }
    });
  }

  hoistUnread() {
    const isRead = (conv: ConversationNotif) => {
      const msg = conv.latestMessage;
      const isMe = msg.user.id == this.authenticationService.getPrincipalId();
      return isMe || msg.isRead;
    }

    const sortDesc = (left: ConversationNotif, right: ConversationNotif) => {
      return right.latestMessage.id - left.latestMessage.id;
    }

    const unreads = this.conversations.filter(conv => !isRead(conv)).sort(sortDesc);
    this.conversations = unreads.concat(this.conversations.filter(isRead).sort(sortDesc));
  }

  loadConversations(): void {
    this.chatService.getLatest().subscribe(latest => {
      this.conversations = this.conversations.concat(latest);
      this.hoistUnread();
    })
  }

  markAsRead(messageId: number): void {
    this.chatService.markAsRead(messageId).subscribe(_ => {
      let conversation = this.conversations.find(conv => conv.latestMessage.id == messageId);
      if (conversation) {
        conversation.latestMessage.isRead = true;
      }
    });
  }
}
