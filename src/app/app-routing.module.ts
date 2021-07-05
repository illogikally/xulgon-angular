import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { AuthenticationGuard } from './components/authentication/authentication.guard'
import { ProfileComponent } from './components/profile/profile.component';
import { FriendRequestComponent } from './components/friend-request/friend-request.component';
import { NewsFeedComponent } from './components/news-feed/news-feed.component';
import { GroupComponent } from './components/group/group.component';
import { GroupGeneralComponent } from './components/group/group-general/group-general.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { GroupContentComponent } from './components/group/group-content/group-content.component';
import { JoinRequestListComponent } from './components/group/join-request-list/join-request-list.component';
import { GroupSettingsComponent } from './components/group/group-settings/group-settings.component';
import { LoggedInComponent } from './components/common/logged-in/logged-in.component';
import { PostViewComponent } from './components/post-view/post-view.component';
import { GroupFeedComponent } from './components/group/group-feed/group-feed.component';
import { SearchComponent } from './components/search/search.component';
import { ByPeopleComponent } from './components/search/by-people/by-people.component';
import { ByPostsComponent } from './components/search/by-posts/by-posts.component';
import { ByGroupsComponent } from './components/search/by-groups/by-groups.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: LoginComponent },
  { 
    path: '', 
    component: LoggedInComponent,
    canActivate: [AuthenticationGuard],
    children: [
      { path: '', component: NewsFeedComponent },
      { 
        path: 'permalink/:id', 
        component: PostViewComponent
      },
      { path: 'friends', component: FriendRequestComponent },
      { 
        path: 'search',
        component: SearchComponent,
        children: [
          { path: '', redirectTo: 'people', pathMatch: 'full'},
          { path: 'people', component: ByPeopleComponent},
          { path: 'groups', component: ByGroupsComponent},
          { path: 'posts', component: ByPostsComponent},
        ]

      },
      { 
        path: 'groups', 
        children: [

          { path: '', redirectTo: 'feed', pathMatch: 'full'},
          { path: 'feed', component: GroupGeneralComponent },
          {
            path: ':id', 
            children: [
              { path: '', component: GroupContentComponent},
              { path: 'about', component: GroupContentComponent},
              { path: 'media', component: GroupContentComponent},
              { path: 'members', component: GroupContentComponent},
              { path: 'member_request', component: JoinRequestListComponent},
              { path: 'settings', component: GroupSettingsComponent}
            ]
          }
        ]
      },
      { 
        path: ':id', 
        children: [
          { path: '', component: ProfileComponent },
          { path: 'about', component: ProfileComponent},
          { path: 'friends', component:  ProfileComponent},
          { path: 'photos', component: ProfileComponent }
        ]
        
      },
      { path: '**', component: ErrorPageComponent}
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload', scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
