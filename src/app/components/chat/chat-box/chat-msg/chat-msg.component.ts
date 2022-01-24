import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from 'src/app/components/authentication/authentication.service';

@Component({
  selector: 'app-chat-msg',
  templateUrl: './chat-msg.component.html',
  styleUrls: ['./chat-msg.component.scss']
})
export class ChatMsgComponent implements OnInit {

  @Input() thisMsg!: any;
  @Input() prevMsg!: any;
  @Input() nextMsg!: any;
  loggedInUserId: number = this.authService.getUserId();
  @Input() avatarUrl!: string;
  @Input() index!: number;

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit(): void {
  }

  isFirstMsg(): boolean {
    return !this.prevMsg 
      || this.thisMsg.createdAt - this.prevMsg.createdAt > 36_000_000
      || this.thisMsg?.userId != this.prevMsg?.userId

  }

  isLastMsg(): boolean {
    return this.thisMsg?.userId != this.nextMsg?.userId || this.displayTimeCheck()
  }

  getCreatedDate(): string {
    const d = new Date(this.thisMsg.createdAt);
    return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()%1000}, 
      ${d.toLocaleString('en-US', {hour: 'numeric', hour12: true, minute: '2-digit'})}`;
  }

  displayTimeCheck(): boolean {
    return (!this.nextMsg || this.thisMsg.createdAt - this.nextMsg.createdAt < -36_000_000);
  }

}
