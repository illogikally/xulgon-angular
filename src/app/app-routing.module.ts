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
import { UserRefAvatarComponent } from './components/common/user-ref-avatar/user-ref-avatar.component';
import { PostSkeletonComponent } from './components/post/post-skeleton/post-skeleton.component';

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
          { path: '', component: GroupTimelineComponent},
          { path: 'about', component: GroupAboutComponent},
          { path: 'media', component: GroupMediaComponent},
          { path: 'members', component: GroupMemberComponent},
        ]

      }
    ]
  },
  { 
    path: ':id', 
    component: ProfileComponent, 
    children: [
      { path: '', component: ProfileTimelineComponent },
      { path: 'friends', component: FriendListComponent },
      { path: 'photos', component: PhotoListComponent }
    ]
    
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
