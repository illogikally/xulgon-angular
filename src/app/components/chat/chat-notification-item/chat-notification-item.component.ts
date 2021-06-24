import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-notification-item',
  templateUrl: './chat-notification-item.component.html',
  styleUrls: ['./chat-notification-item.component.scss']
})
export class ChatNotificationItemComponent implements OnInit {

  @Input() name!: string;
  @Input() msg!: string;
  @Input() ago!: string;
  @Input() url!: string;
  constructor() { }

  ngOnInit(): void {
  }

}
