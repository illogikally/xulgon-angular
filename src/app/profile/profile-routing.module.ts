import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfileComponent} from "./profile.component";
import {ProfileHeaderResolver} from "./profile-header.resolver";
import {ProfileTimelineComponent} from "./profile-timeline/profile-timeline.component";
import {FriendListComponent} from "./friend-list/friend-list.component";
import {PhotoListComponent} from "./photo-list/photo-list.component";
import {ProfileAboutComponent} from "../shared/components/profile-about/profile-about.component";

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    resolve: {
      header: ProfileHeaderResolver
    },
    children: [
      {
        path: '',
        component: ProfileTimelineComponent,
        pathMatch: 'full',
        data: {preload: true, delay: 1000},
        loadChildren: () => import('./profile-timeline/profile-timeline.module').then(m => m.ProfileTimelineModule)
      },
      { path: 'about', component: ProfileAboutComponent },
      {
        path: 'friends',
        component: FriendListComponent,
        loadChildren: () => import('./friend-list/friend-list.module').then(m => m.FriendListModule),
        data: {preload: true, delay: 1000},
      },
      { path: 'photos', component: PhotoListComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
