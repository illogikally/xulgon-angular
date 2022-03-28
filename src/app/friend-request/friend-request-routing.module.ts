import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoggedInService} from "../logged-in/logged-in.service";
import {FriendRequestComponent} from "./friend-request.component";
import {ProfileComponent} from "../profile/profile.component";
import {ProfileHeaderResolver} from "../profile/profile-header.resolver";
import {ProfileTimelineComponent} from "../profile/profile-timeline/profile-timeline.component";
import {FriendListComponent} from "../profile/friend-list/friend-list.component";
import {PhotoListComponent} from "../profile/photo-list/photo-list.component";
import {ProfileAboutComponent} from "../shared/components/profile-about/profile-about.component";

const routes: Routes = [
  LoggedInService.withLoggedIn([
    {
      path: '',
      component: FriendRequestComponent,
      children: [
        {
          path: ':id',
          component: ProfileComponent,
          resolve: {
            header: ProfileHeaderResolver
          },
          children: [
            { path: '', component: ProfileTimelineComponent },
            { path: 'about', component: ProfileAboutComponent },
            { path: 'friends', component: FriendListComponent },
            { path: 'photos', component: PhotoListComponent }
          ]
        }
      ]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FriendRequestRoutingModule { }
