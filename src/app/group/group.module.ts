import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GroupRoutingModule} from './group-routing.module';
import {GroupAboutComponent} from "./group-about/group-about.component";
import {GroupContentComponent} from "./group-content/group-content.component";
import {GroupDiscoverComponent} from "./group-discover/group-discover.component";
import {GroupDiscoverItemComponent} from "./group-discover/group-discover-item/group-discover-item.component";
import {GroupFeedComponent} from "./group-feed/group-feed.component";
import {GroupGeneralComponent} from "./group-general/group-general.component";
import {CreateNewGroupComponent} from "./group-general/create-new-group/create-new-group.component";
import {
  GroupGeneralGroupItemComponent
} from "./group-general/group-general-group-item/group-general-group-item.component";
import {GroupMemberComponent} from "./group-member/group-member.component";
import {GroupMediaComponent} from "./group-media/group-media.component";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {ClickOutsideModule} from "ng-click-outside";
import {GroupMemberItemComponent} from "./group-member/group-member-item/group-member-item.component";
import {GroupSettingsComponent} from "./group-settings/group-settings.component";
import {GroupTimelineComponent} from "./group-timeline/group-timeline.component";
import {JoinRequestListComponent} from "./join-request-list/join-request-list.component";
import {JoinRequestItemComponent} from "./join-request-list/join-request-item/join-request-item.component";
import {PostModule} from "../post/post.module";
import {GroupComponent} from "./group.component";
import {PostViewModule} from "../post-view/post-view.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    GroupAboutComponent,
    GroupContentComponent,
    GroupDiscoverComponent,
    GroupDiscoverItemComponent,
    GroupFeedComponent,
    GroupGeneralComponent,
    CreateNewGroupComponent,
    GroupGeneralGroupItemComponent,
    GroupMemberComponent,
    GroupMediaComponent,
    GroupMemberComponent,
    GroupMemberItemComponent,
    GroupSettingsComponent,
    GroupTimelineComponent,
    JoinRequestListComponent,
    JoinRequestItemComponent,
    GroupComponent
  ],
  imports: [
    CommonModule,
    PostModule,
    ReactiveFormsModule,
    PostViewModule,
    SharedModule,
    RouterModule,
    ClickOutsideModule,
    GroupRoutingModule
  ]
})
export class GroupModule { }
