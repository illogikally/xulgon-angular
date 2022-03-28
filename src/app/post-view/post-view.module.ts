import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PostViewComponent} from "./post-view.component";
import {PostModule} from "../post/post.module";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {PostViewRoutingModule} from "./post-view-routing.module";


@NgModule({
  declarations: [
    PostViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PostViewRoutingModule,
    PostModule
  ],
  exports: [
    PostViewComponent
  ]
})
export class PostViewModule { }
