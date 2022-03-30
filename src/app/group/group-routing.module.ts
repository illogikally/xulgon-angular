import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GroupGeneralComponent} from "./group-general/group-general.component";
import {GroupFeedComponent} from "./group-feed/group-feed.component";
import {GroupDiscoverComponent} from "./group-discover/group-discover.component";
import {GroupComponent} from "./group.component";
import {GroupContentComponent} from "./group-content/group-content.component";
import {GroupAboutComponent} from "./group-about/group-about.component";
import {GroupMediaComponent} from "./group-media/group-media.component";
import {GroupMemberComponent} from "./group-member/group-member.component";
import {JoinRequestListComponent} from "./join-request-list/join-request-list.component";
import {GroupSettingsComponent} from "./group-settings/group-settings.component";
import {GroupTimelineComponent} from "./group-timeline/group-timeline.component";
import {GroupAdminGuard} from "./group-admin.guard";
import {GroupResolver} from "./resolvers/group.resolver";

const groupPageRoutes = 
  {
    path: ':id',
    resolve: {group: GroupResolver},
    component: GroupComponent,
    children: [
      {
        path: '',
        component: GroupContentComponent,
        children: [
          {path: '', component: GroupTimelineComponent, pathMatch: 'full', data: {isPostView: false }},
          {path: 'posts/:id', component: GroupTimelineComponent, data: {isPostView: true }},
          {path: 'about', component: GroupAboutComponent},
          {path: 'media', component: GroupMediaComponent},
          {path: 'members', component: GroupMemberComponent},
        ]
      },
      { path: 'member_request', component: JoinRequestListComponent, canActivate: [GroupAdminGuard] },
      { path: 'settings', component: GroupSettingsComponent, canActivate: [GroupAdminGuard] }
    ]
  };
const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      {
        path: 'feed', component: GroupGeneralComponent,
        children: [
          { path: '', component: GroupFeedComponent, pathMatch: 'full' },
          { path: 'discover', component: GroupDiscoverComponent },
          groupPageRoutes
        ]
      },
      groupPageRoutes
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
