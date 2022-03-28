import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NewsFeedRoutingModule} from './news-feed-routing.module';
import {NewsFeedComponent} from "./news-feed.component";
import {SharedModule} from "../shared/shared.module";
import {PostModule} from "../post/post.module";


@NgModule({
  declarations: [
    NewsFeedComponent
  ],
  imports: [
    NewsFeedRoutingModule,
    CommonModule,
    PostModule,
    SharedModule
  ]
})
export class NewsFeedModule { }
