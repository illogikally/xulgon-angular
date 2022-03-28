import {RouterModule, Routes} from "@angular/router";
import {NewsFeedComponent} from "../news-feed/news-feed.component";
import {NgModule} from "@angular/core";
import {LoggedInComponent} from "./logged-in.component";

const routes: Routes = [
  {
    path: '',
    component: LoggedInComponent,
    children: [
      { path: '', component: NewsFeedComponent },
      { path: 'friends', loadChildren: () => import('../friend-request/friend-request.module').then(m => m.FriendRequestModule)},
      { path: 'groups', loadChildren: () => import('../group/group.module').then(m => m.GroupModule)},
      { path: ':id', loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule)}
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoggedInRoutingModule {}
