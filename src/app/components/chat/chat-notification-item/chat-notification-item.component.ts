import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MessageService} from '../../share/message.service';
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

  principalId: number;
  isRead = false;


  constructor(
    private messageService: MessageService,
    private authenticationService: AuthenticationService
  ) {
    this.principalId = this.authenticationService.getPrincipalId();
  }

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
