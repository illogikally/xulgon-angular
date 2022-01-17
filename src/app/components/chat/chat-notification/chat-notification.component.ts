import {Component, ElementRef, EventEmitter, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {RxStompService} from '@stomp/ng2-stompjs';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ChatService} from '../../service/chat.service';
import {ChatMessage} from '../chat-msg';
import {ConversationNotif} from '../conversation-notif';

@Component({
  selector: 'app-chat-notification',
  templateUrl: './chat-notification.component.html',
  styleUrls: ['./chat-notification.component.scss']
})
export class ChatNotificationComponent implements OnInit {

  unreadCount!: number;
  latestConversations = new Array<ConversationNotif>();
  conversationRead = new EventEmitter<number>();


  @ViewChild('popup', {static: true}) popup!: ElementRef;

  constructor(private chatService: ChatService,
              private title: Title,
              private auth$: AuthenticationService,
              private rxStomp$: RxStompService,
              private renderer: Renderer2) {
  }

  private setTitle(): void {
    let regex = /\([\d ]+\)/g;
    let title = this.title.getTitle();

    if (regex.test(title)) {
      let title = this.title.getTitle().replace(regex, this.unreadCount > 0 ? `(${this.unreadCount})` : '');
      this.title.setTitle(title);
    } else if (this.unreadCount > 0)
      this.title.setTitle(`(${this.unreadCount}) ${this.title.getTitle()}`)
  }

  ngOnInit(): void {
    this.loadConversations();

    this.conversationRead.subscribe(messageId => {
      this.unreadCount--;
      this.markAsRead(messageId);

      this.setTitle();
    });

    this.chatService.getUnreadCount().subscribe(count => {
      this.unreadCount = count;
      this.setTitle();
    });

    this.rxStomp$.watch('/user/queue/chat').subscribe(msg => {
      let chatMsg: ChatMessage = JSON.parse(msg.body);
      let conversation = this.latestConversations.find(conv => conv.id == chatMsg.conversationId)
      if (conversation) {
        if (chatMsg.userId !== this.auth$.getUserId()
          && (conversation.latestMessage.userId !== chatMsg.userId
            || conversation.latestMessage.isRead === true)) {
          this.unreadCount++;
          this.setTitle();
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
    this.renderer.setStyle(this.popup.nativeElement,
      'display',
      this.popup.nativeElement.style.display == 'block' ? 'none' : 'block');
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
