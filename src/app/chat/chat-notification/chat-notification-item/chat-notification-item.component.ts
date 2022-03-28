import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../../core/authentication/authentication.service';
import {MessageService} from '../../../shared/services/message.service';
import {ConversationNotif} from '../conversation-notif';

@Component({
  selector: 'app-chat-notification-item',
  templateUrl: './chat-notification-item.component.html',
  styleUrls: ['./chat-notification-item.component.scss']
})
export class ChatNotificationItemComponent implements OnInit {

  @Input() conversation!: ConversationNotif;
  @Input() conversationRead!: EventEmitter<number>;
  @Output() itemClick = new EventEmitter();
  @ViewChild('opts') opts!: ElementRef;

  principalId = this.authenticationService.getPrincipalId();
  isRead = false;

  constructor(
    private messageService: MessageService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
  }

  openChatBox(): void {
    this.messageService.openChatBox$.next(this.conversation.user);
    this.itemClick.emit();
  }

  isConversationRead(): boolean {
    let isMe = this.conversation.latestMessage.user.id == this.principalId;
    return isMe || this.conversation.latestMessage.isRead;
  }

  read(): void {
    this.conversationRead.emit(this.conversation.latestMessage.id);
  }

}
