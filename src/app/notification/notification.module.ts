import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotificationComponent} from "./notification/notification.component";
import {NotificationItemComponent} from "./notif-item/notification-item.component";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    NotificationComponent,
    NotificationItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  exports: [
    NotificationComponent
  ]
})
export class NotificationModule { }
