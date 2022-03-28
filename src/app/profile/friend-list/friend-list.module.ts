import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FriendListComponent} from "./friend-list.component";
import {FriendListItemComponent} from "./friend-list-item/friend-list-item.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    FriendListComponent,
    FriendListItemComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
  ],
})
export class FriendListModule { }
