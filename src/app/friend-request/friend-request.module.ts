import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FriendRequestRoutingModule} from './friend-request-routing.module';
import {FriendRequestComponent} from "./friend-request.component";
import {FriendRequestItemComponent} from "./friend-request-item/friend-request-item.component";
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [
    FriendRequestComponent,
    FriendRequestItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FriendRequestRoutingModule
  ]
})
export class FriendRequestModule { }
