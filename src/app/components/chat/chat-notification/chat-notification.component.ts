import { Component, ElementRef, EventEmitter, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RxStompService } from '@stomp/ng2-stompjs';
import { AuthenticationService } from '../../authentication/authentication.service';
import { NotificationService } from '../../notification/notification.service';
import { TitleService } from '../../share/title.service';
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
    private chatService: ChatService,
    private title: Title,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private rxStompService: RxStompService,
    private titleService: TitleService,
    private renderer: Renderer2) {
  }

  private setTitle(): void {
    // let regex = /\([\d ]+\)/g;
    // let title = this.title.getTitle();

    // let totalUnread = this.unreadCount + this.unreadNotificationCount;
    // if (regex.test(title)) {
    //   let title = this.title.getTitle().replace(regex, totalUnread > 0 ? `(${totalUnread})` : '');
    //   this.title.setTitle(title);
    // } else if (totalUnread > 0)
    //   this.title.setTitle(`(${totalUnread}) ${this.title.getTitle()}`)
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
        if (chatMsg.userId !== this.authenticationService.getPrincipalId()
          && (conversation.latestMessage.userId !== chatMsg.userId
            || conversation.latestMessage.isRead === true)) {
          this.unreadCount++;
          this.titleService.modifyNotificationCount(1);
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
