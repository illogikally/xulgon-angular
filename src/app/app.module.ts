import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { LoginComponent } from './components/authentication/login/login.component'
import { NgxWebstorageModule } from 'ngx-webstorage';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostComponent } from './components/post/post.component';
import { AuthenticationInterceptor } from './authentication.interceptor';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentComponent } from './components/comment-list/comment/comment.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CreatePostComponent } from './components/post/create-post/create-post.component'
import { PhotoComponent } from './components/common/photo/photo.component';
import { PhotoViewerComponent } from './components/photo-viewer/photo-viewer.component';
import { XBtnComponent } from './components/common/x-btn/x-btn.component';
import { FriendRequestComponent } from './components/friend-request/friend-request.component';
import { FriendRequestItemComponent } from './components/friend-request-item/friend-request-item.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { NewsFeedComponent } from './components/news-feed/news-feed.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { FriendListComponent } from './components/profile/friend-list/friend-list.component';
import { FriendListItemComponent } from './components/profile/friend-list/friend-list-item/friend-list-item.component';
import { HeaderComponent } from './components/profile/header/header.component';
import { ProfileTemplateComponent } from './components/profile/profile-template/profile-template.component';
import { ProfileTimelineComponent } from './components/profile/profile-timeline/profile-timeline.component';
import { PhotoListComponent } from './components/profile/photo-list/photo-list.component';
import { PhotoListItemComponent } from './components/profile/photo-list/photo-list-item/photo-list-item.component';
import { SquareImageComponent } from './components/common/square-image/square-image.component';
import { PickAvatarComponent } from './components/profile/pick-avatar/pick-avatar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    PostListComponent,
    PostComponent,
    CommentListComponent,
    CommentComponent,
    ProfileComponent,
    CreatePostComponent,
    PhotoComponent,
    PhotoViewerComponent,
    XBtnComponent,
    FriendRequestComponent,
    FriendRequestItemComponent,
    ErrorPageComponent,
    ProfilePageComponent,
    NewsFeedComponent,
    FriendListComponent,
    FriendListItemComponent,
    HeaderComponent,
    ProfileTemplateComponent,
    ProfileTimelineComponent,
    PhotoListComponent,
    PhotoListItemComponent,
    SquareImageComponent,
    PickAvatarComponent,
  ],
  imports: [
    ClickOutsideModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
