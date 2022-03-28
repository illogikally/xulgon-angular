import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SearchRoutingModule} from './search-routing.module';
import {SearchComponent} from "./search.component";
import {ByPostsComponent} from "./by-posts/by-posts.component";
import {ByGroupsComponent} from "./by-groups/by-groups.component";
import {ByPeopleComponent} from "./by-people/by-people.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {PostModule} from "../post/post.module";
import {ByPeopleResultComponent} from "./by-people/by-people-result/by-people-result.component";
import {ByGroupResultComponent} from "./by-people/by-group-result/by-group-result.component";

@NgModule({
  declarations: [
    SearchComponent,
    ByPostsComponent,
    ByPeopleResultComponent,
    ByGroupResultComponent,
    ByGroupsComponent,
    ByPeopleComponent
  ],

  imports: [
    PostModule,
    CommonModule,
    RouterModule,
    SharedModule,
    SearchRoutingModule
  ],
  exports: [
    SearchComponent
  ]
})
export class SearchModule { }
