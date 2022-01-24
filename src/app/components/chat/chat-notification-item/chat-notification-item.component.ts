import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MessageService} from '../../common/message.service';
import {ConversationNotif} from '../conversation-notif';

@Component({
  selector: 'app-chat-notification-item',
  templateUrl: './chat-notification-item.component.html',
  styleUrls: ['./chat-notification-item.component.scss']
})
export class ChatNotificationItemComponent implements OnInit {

  @Input() conversation!: ConversationNotif;
  @Output() close = new EventEmitter<void>();
  @Input() conversationRead!: EventEmitter<number>;

  @ViewChild('opts') opts!: ElementRef;
  @ViewChild('markAsRead') markAsRead!: ElementRef;

  loggedInUserId!: number;
  isRead!: boolean;


  constructor(private messageService: MessageService,
              private auth$: AuthenticationService) {
    this.loggedInUserId = this.auth$.getUserId();
  }

  ngOnInit(): void {
  }

  openChatBox(event: any): void {
    let excludes = [...
      this.markAsRead.nativeElement.querySelectorAll('*'),
      this.markAsRead.nativeElement]

    if (!excludes.includes(event.target)) {
      this.messageService.openChatBox$.next(this.conversation.user);
      this.close.emit();
    }
  }

  isConversationRead(): boolean {
    if (this.conversation.latestMessage.userId == this.auth$.getUserId()) return true;
    return this.conversation.latestMessage.isRead;
  }

  read(): void {
    this.conversationRead.emit(this.conversation.latestMessage.id);
  }

}
