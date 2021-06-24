import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/components/authentication/authentication.service';

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

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    
  }

  isFirstMsg(): boolean {
    return this.thisMsg?.userId != this.prevMsg?.userId;
  }

  isLastMsg(): boolean {
    return this.thisMsg?.userId != this.nextMsg?.userId 
  }

}
