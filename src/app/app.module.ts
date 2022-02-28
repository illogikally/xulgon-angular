import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { LoginComponent } from './components/authentication/login/login.component'
import { NgxWebstorageModule } from 'ngx-webstorage';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PostListComponent } from './components/post/post-list/post-list.component';
import { PostComponent } from './components/post/post.component';
import { AuthenticationInterceptor } from './authentication.interceptor';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentComponent } from './components/comment-list/comment/comment.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CreatePostComponent } from './components/post/create-post/create-post.component'
import { PhotoComponent } from './components/share/photo/photo.component';
import { PhotoViewerComponent } from './components/photo-viewer/photo-viewer.component';
import { FriendRequestComponent } from './components/friend-request/friend-request.component';
import { FriendRequestItemComponent } from './components/friend-request/friend-request-item/friend-request-item.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { NewsFeedComponent } from './components/news-feed/news-feed.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { FriendListComponent } from './components/profile/friend-list/friend-list.component';
import { FriendListItemComponent } from './components/profile/friend-list/friend-list-item/friend-list-item.component';
import { ProfileTimelineComponent } from './components/profile/profile-timeline/profile-timeline.component';
import { PhotoListComponent } from './components/profile/photo-list/photo-list.component';
import { PhotoListItemComponent } from './components/profile/photo-list/photo-list-item/photo-list-item.component';
import { SquareImageComponent } from './components/share/square-image/square-image.component';
import { PickAvatarComponent } from './components/profile/pick-avatar/pick-avatar.component';
import { GroupComponent } from './components/group/group.component';
import { GroupGeneralComponent } from './components/group/group-general/group-general.component';
import { GroupAboutComponent } from './components/group/group-about/group-about.component';
import { GroupMemberComponent } from './components/group/group-member/group-member.component';
import { GroupMediaComponent } from './components/group/group-media/group-media.component';
import { GroupTimelineComponent } from './components/group/group-timeline/group-timeline.component';
import { GroupCreatePostComponent } from './components/group/group-timeline/group-create-post/group-create-post.component';
import { UserRefComponent } from './components/share/user-ref/user-ref.component';
import { UserRefPopupComponent } from './components/share/user-ref/user-ref-popup/user-ref-popup.component';
import { PostSkeletonComponent } from './components/post/post-skeleton/post-skeleton.component';
import { JoinRequestListComponent } from './components/group/join-request-list/join-request-list.component';
import { GroupContentComponent } from './components/group/group-content/group-content.component';
import { JoinRequestItemComponent } from './components/group/join-request-list/join-request-item/join-request-item.component';
import { InjectableRxStompRpcConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { MyRxStompConfig } from './my-rx-stomp.config';
import { AuthenticationService } from './components/authentication/authentication.service';
import { ChatNotificationComponent } from './components/chat/chat-notification/chat-notification.component';
import { ChatNotificationItemComponent } from './components/chat/chat-notification-item/chat-notification-item.component';
import { ChatBoxComponent } from './components/chat/chat-box/chat-box.component';
import { ChatMsgComponent } from './components/chat/chat-box/chat-msg/chat-msg.component';
import { ProfileAboutComponent } from './components/profile/profile-about/profile-about.component';
import { GroupSettingsComponent } from './components/group/group-settings/group-settings.component';
import { LoggedInComponent } from './components/share/logged-in/logged-in.component';
import { NotificationComponent } from './components/notification/notification/notification.component';
import { NotifItemComponent } from './components/notification/notif-item/notif-item.component';
import { PostViewComponent } from './components/post/post-view/post-view.component';
import { GroupFeedComponent } from './components/group/group-feed/group-feed.component';
import { SearchComponent } from './components/search/search.component';
import { ByPeopleComponent } from './components/search/by-people/by-people.component';
import { ByGroupsComponent } from './components/search/by-groups/by-groups.component';
import { ByPostsComponent } from './components/search/by-posts/by-posts.component';
import { ResultComponent } from './components/search/by-people/result/result.component';
import { ByPeopleResultComponent } from './components/search/by-people/by-people-result/by-people-result.component';
import { ByGroupResultComponent } from './components/search/by-people/by-group-result/by-group-result.component';
import { NavigationEnd, NavigationStart, Router, RouteReuseStrategy, Scroll } from '@angular/router';
import { MyReuseStrategy } from './my-reuse-trategy';
import { MessageService } from './components/share/message.service';
import { Oauth2CallbackComponent } from './components/authentication/login/oauth2-callback/oauth2-callback.component';
import { ViewportScroller } from '@angular/common';
import { ButtonComponent } from './components/share/button/button.component';
import { TestingComponent } from './components/share/testing/testing.component';
import { FriendshipButtonComponent } from './components/profile/friendship-button/friendship-button.component';
import { ConfirmDialogComponent } from './components/share/confirm-dialog/confirm-dialog.component';
import { PopUpComponent } from './components/share/pop-up/pop-up.component';
import { StickySidebarDirective } from './components/profile/sticky-sidebar.directive';
import { TabBarComponent } from './components/profile/tab-bar/tab-bar.component';
import { SpinnerComponent } from './components/share/spinner/spinner.component';
import { ToasterComponent } from './components/share/toaster/toaster.component';
import { PhotoViewerPlaceholderComponent } from './components/photo/photo-viewer/photo-viewer-placeholder/photo-viewer-placeholder.component';

@NgModule({
  declarations: [
    LoggedInComponent,
    AppComponent,
    LoginComponent,
    NavbarComponent,
    PostListComponent,
    PostComponent,
    CommentListComponent,
    CommentComponent,
    ProfileComponent,
    CreatePostComponent,
    PhotoComponent,
    PhotoViewerComponent,
    FriendRequestComponent,
    FriendRequestItemComponent,
    ErrorPageComponent,
    NewsFeedComponent,
    FriendListComponent,
    FriendListItemComponent,
    ProfileTimelineComponent,
    PhotoListComponent,
    PhotoListItemComponent,
    SquareImageComponent,
    PickAvatarComponent,
    GroupComponent,
    GroupGeneralComponent,
    GroupAboutComponent,
    GroupMemberComponent,
    GroupMediaComponent,
    GroupTimelineComponent,
    GroupCreatePostComponent,
    UserRefComponent,
    UserRefPopupComponent,
    PostSkeletonComponent,
    JoinRequestListComponent,
    GroupContentComponent,
    JoinRequestItemComponent,
    ChatNotificationComponent,
    ChatNotificationItemComponent,
    ChatBoxComponent,
    ChatMsgComponent,
    ProfileAboutComponent,
    GroupSettingsComponent,
    NotificationComponent,
    NotifItemComponent,
    PostViewComponent,
    GroupFeedComponent,
    SearchComponent,
    ByPeopleComponent,
    ByGroupsComponent,
    ByPostsComponent,
    ResultComponent,
    ByPeopleResultComponent,
    ByGroupResultComponent,
    Oauth2CallbackComponent,
    ButtonComponent,
    TestingComponent,
    FriendshipButtonComponent,
    ConfirmDialogComponent,
    PopUpComponent,
    StickySidebarDirective,
    TabBarComponent,
    SpinnerComponent,
    ToasterComponent,
    PhotoViewerPlaceholderComponent,
  ],
  imports: [
    FormsModule,
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
      provide: RouteReuseStrategy,
      useClass: MyReuseStrategy,
      deps: [MessageService]
    },
    {
      provide: InjectableRxStompRpcConfig,
      useClass: MyRxStompConfig,
      deps: [AuthenticationService]
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompRpcConfig]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private router: Router,
    private scroller: ViewportScroller
  ) {
    let isNavigateSameRoute = true;
    this.router.events.subscribe(e  => {
      if (e instanceof NavigationStart) {
        if ( router.url == (e as NavigationStart).url) {
          if (e.navigationTrigger != 'popstate') {
            window.scrollTo({top: 0, behavior: 'smooth'});
          }
          isNavigateSameRoute = true;
        } else {
          isNavigateSameRoute = false;
        }
      } else if (e instanceof NavigationEnd) {
        if (!isNavigateSameRoute) 
          this.scroller.scrollToPosition([0, 0]);
      }
    });
  }
}
