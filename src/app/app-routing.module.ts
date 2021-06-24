import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { AuthenticationGuard } from './components/authentication/authentication.guard'
import { HomeComponent } from './components/home/home.component'
import { NavbarComponent } from './components/navbar/navbar.component'
import { ProfileComponent } from './components/profile/profile.component';
import { CreatePostComponent } from './components/post/create-post/create-post.component'
import { PhotoComponent } from './components/common/photo/photo.component';
import { PhotoViewerComponent } from './components/photo-viewer/photo-viewer.component';
import { FriendRequestComponent } from './components/friend-request/friend-request.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { NewsFeedComponent } from './components/news-feed/news-feed.component';
import { FriendListComponent } from './components/profile/friend-list/friend-list.component';
import { ProfileTimelineComponent } from './components/profile/profile-timeline/profile-timeline.component';
import { PhotoListComponent } from './components/profile/photo-list/photo-list.component';
import { GroupComponent } from './components/group/group.component';
import { GroupFeedComponent } from './components/group/group-feed/group-feed.component';
import { GroupTimelineComponent } from './components/group/group-timeline/group-timeline.component';
import { GroupAboutComponent } from './components/group/group-about/group-about.component';
import { GroupMediaComponent } from './components/group/group-media/group-media.component';
import { GroupMemberComponent } from './components/group/group-member/group-member.component';
import { UserRefComponent } from './components/common/user-ref/user-ref.component';
import { PostSkeletonComponent } from './components/post/post-skeleton/post-skeleton.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { GroupContentComponent } from './components/group/group-content/group-content.component';
import { JoinRequestListComponent } from './components/group/join-request-list/join-request-list.component';
import { GroupSettingsComponent } from './components/group/group-settings/group-settings.component';

const routes: Routes = [
  { path: '', component: NewsFeedComponent },
  { path: 'login', component: LoginComponent },
  { path: 'friends', component: FriendRequestComponent },
  { path: 'test', component: PostSkeletonComponent},
  { 
    path: 'groups', 
    children: [

      { path: '', redirectTo: 'feed', pathMatch: 'full'},
      { path: 'feed', component: GroupFeedComponent},
      {
        path: ':id', 
        component: GroupComponent,
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
    component: ProfileComponent, 
    children: [
      { path: '', component: ProfileComponent },
      { path: 'about', component: ProfileComponent},
      { path: 'friends', component:  ProfileComponent},
      { path: 'photos', component: ProfileComponent }
    ]
    
  },
  { path: '**', component: ErrorPageComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
