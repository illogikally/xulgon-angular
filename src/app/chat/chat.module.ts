import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatBoxComponent} from "./chat-box/chat-box.component";
import {ChatNotificationComponent} from "./chat-notification/chat-notification.component";
import {
  ChatNotificationItemComponent
} from "./chat-notification/chat-notification-item/chat-notification-item.component";
import {ChatMsgComponent} from "./chat-box/chat-msg/chat-msg.component";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ChatBoxComponent,
    ChatNotificationComponent,
    ChatNotificationItemComponent,
    ChatMsgComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    ChatBoxComponent,
    ChatNotificationComponent
  ]
})
export class ChatModule { }
