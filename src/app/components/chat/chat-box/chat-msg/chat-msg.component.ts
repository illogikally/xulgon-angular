import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from 'src/app/components/authentication/authentication.service';
import {ChatMessage} from '../../chat-msg';

@Component({
  selector: 'app-chat-msg',
  templateUrl: './chat-msg.component.html',
  styleUrls: ['./chat-msg.component.scss']
})
export class ChatMsgComponent implements OnInit {

  @Input() thisMsg!: ChatMessage;
  @Input() prevMsg!: ChatMessage | null;
  @Input() nextMsg!: ChatMessage | null;
  @Input() avatarUrl!: string;

  principalId = this.authenticationService.getAuthentication()!.userId;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
  }

  isFirstMsg(): boolean {
    return !this.prevMsg
      || this.thisMsg.createdAt - this.prevMsg.createdAt > 36e6
      || this.thisMsg!.user.id != this.prevMsg?.user.id
  }

  isLastMsg(): boolean {
    return this.thisMsg?.user.id != this.nextMsg?.user.id || this.displayTimeCheck()
  }

  getCreatedDate(): string {
    const d = new Date(this.thisMsg.createdAt);
    return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()%1000},
      ${d.toLocaleString('en-US', {hour: 'numeric', hour12: true, minute: '2-digit'})}`;
  }

  displayTimeCheck(): boolean {
    const time = this.nextMsg?.createdAt || Date.now();
    return time - this.thisMsg.createdAt > 36e6
  }

}
