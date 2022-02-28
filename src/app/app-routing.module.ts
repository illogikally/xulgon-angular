import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { AuthenticationGuard } from './components/authentication/authentication.guard'
import { ProfileComponent } from './components/profile/profile.component';
import { FriendRequestComponent } from './components/friend-request/friend-request.component';
import { NewsFeedComponent } from './components/news-feed/news-feed.component';
import { GroupGeneralComponent } from './components/group/group-general/group-general.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { GroupContentComponent } from './components/group/group-content/group-content.component';
import { JoinRequestListComponent } from './components/group/join-request-list/join-request-list.component';
import { GroupSettingsComponent } from './components/group/group-settings/group-settings.component';
import { LoggedInComponent } from './components/share/logged-in/logged-in.component';
import { PostViewComponent } from './components/post/post-view/post-view.component';
import { SearchComponent } from './components/search/search.component';
import { ByPeopleComponent } from './components/search/by-people/by-people.component';
import { ByPostsComponent } from './components/search/by-posts/by-posts.component';
import { ByGroupsComponent } from './components/search/by-groups/by-groups.component';
import { ProfileAboutComponent } from './components/profile/profile-about/profile-about.component';
import { FriendListComponent } from './components/profile/friend-list/friend-list.component';
import { PhotoListComponent } from './components/profile/photo-list/photo-list.component';
import { ProfileTimelineComponent } from './components/profile/profile-timeline/profile-timeline.component';
import { GroupComponent } from './components/group/group.component';
import { ProfileHeaderResolver } from './components/profile/profile-header.resolver';
import { Oauth2CallbackComponent } from './components/authentication/login/oauth2-callback/oauth2-callback.component';
import { GroupFeedComponent } from './components/group/group-feed/group-feed.component';
import { GroupAboutComponent } from './components/group/group-about/group-about.component';
import { GroupMediaComponent } from './components/group/group-media/group-media.component';
import { GroupMemberComponent } from './components/group/group-member/group-member.component';
import { GroupTimelineComponent } from './components/group/group-timeline/group-timeline.component';
import { ButtonComponent } from './components/share/button/button.component';
import { TestingComponent } from './components/share/testing/testing.component';
import { PhotoViewerPlaceholderComponent } from './components/photo/photo-viewer/photo-viewer-placeholder/photo-viewer-placeholder.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: LoginComponent },
  { path: 'testing', component: TestingComponent},
  { 
    path: 'oauth2', 
    children: [
      { path: 'callback', component: Oauth2CallbackComponent }
    ]
  },
  {
    path: '',
    component: LoggedInComponent,
    canActivate: [AuthenticationGuard],
    children: [
      { path: '', component: NewsFeedComponent },
      {
        path: 'friends',
        component: FriendRequestComponent,
        // children: [
        //   {
        //     path: ':id',
        //     component: ProfileComponent,
        //     children: [
        //       { path: '', component: ProfileTimelineComponent},
        //       { path: 'about', component: ProfileAboutComponent},
        //       { path: 'friends', component: FriendListComponent},
        //       { path: 'photos', component: PhotoListComponent}
        //     ]
        //   }
        // ]
      },
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
        path: 'photo',
        children: [
          {path: ':id', component: PhotoViewerPlaceholderComponent},
        ]
      },
      {
        path: 'groups',
        children: [
          { path: '', redirectTo: 'feed', pathMatch: 'full'},
          { path: 'feed', component: GroupGeneralComponent,
            // children: [
            //   { path: '', component: GroupFeedComponent, pathMatch: 'full'}
            // ]
          },
          {
            path: ':id',
            component: GroupComponent,
            children: [
              { 
                path: '', 
                component: GroupContentComponent, 
                children: [
                  { path: '', component: GroupTimelineComponent, pathMatch: 'full', data: {isPostView: false} },
                  { path: 'posts/:id', component: GroupTimelineComponent, data: {isPostView: true} },
                  { path: 'about', component: GroupAboutComponent },
                  { path: 'media', component: GroupMediaComponent },
                  { path: 'members', component: GroupMemberComponent },
                ]
              },
              { path: 'member_request', component: JoinRequestListComponent},
              { path: 'settings', component: GroupSettingsComponent}
            ]
          }
        ]
      },
      {
        path: ':id/posts/:id',
        component: PostViewComponent
      },
      {
        path: ':id',
        component: ProfileComponent,
        resolve: {
          header: ProfileHeaderResolver
        },
        children: [
          { path: '', component: ProfileTimelineComponent, pathMatch: 'full'},
          { path: 'about', component: ProfileAboutComponent},
          { path: 'friends', component:  FriendListComponent},
          { path: 'photos', component: PhotoListComponent}
        ]
      },
      // {
      //   path: ':id',
      //   component: ProfileComponent,
      //   outlet: 'profile',
      //   children: [
      //     { path: '', component: ProfileTimelineComponent},
      //     { path: 'about', component: ProfileAboutComponent},
      //     { path: 'friends', component:  FriendListComponent},
      //     { path: 'photos', component: PhotoListComponent}
      //   ]
      // },
      { path: '**', component: ErrorPageComponent}
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(
    routes, 
    {
      onSameUrlNavigation: 'reload', 
      scrollPositionRestoration: 'disabled'
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
