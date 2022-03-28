import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileTimelineComponent} from "./profile-timeline.component";
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";
import {PostModule} from "../../post/post.module";


@NgModule({
  declarations: [
    ProfileTimelineComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    PostModule,
    CommonModule
  ]
})
export class ProfileTimelineModule { }
