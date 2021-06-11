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

const routes: Routes = [
  { path: '', component: NewsFeedComponent },
  { path: 'login', component: LoginComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'friend_requests', component: FriendRequestComponent },
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
