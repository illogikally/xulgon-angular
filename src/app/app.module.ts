import { ViewportScroller } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, NavigationStart, Router, RouteReuseStrategy } from '@angular/router';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { InjectableRxStompRpcConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { ClickOutsideModule } from 'ng-click-outside';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationInterceptor } from './authentication.interceptor';
import { AuthenticationService } from './components/authentication/authentication.service';
import { LoginComponent } from './components/authentication/login/login.component';
import { Oauth2CallbackComponent } from './components/authentication/login/oauth2-callback/oauth2-callback.component';
import { ChatBoxComponent } from './components/chat/chat-box/chat-box.component';
import { ChatMsgComponent } from './components/chat/chat-box/chat-msg/chat-msg.component';
import { ChatNotificationItemComponent } from './components/chat/chat-notification-item/chat-notification-item.component';
import { ChatNotificationComponent } from './components/chat/chat-notification/chat-notification.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentComponent } from './components/comment-list/comment/comment.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { FriendRequestItemComponent } from './components/friend-request/friend-request-item/friend-request-item.component';
import { FriendRequestComponent } from './components/friend-request/friend-request.component';
import { GroupAboutComponent } from './components/group/group-about/group-about.component';
import { GroupContentComponent } from './components/group/group-content/group-content.component';
import { GroupDiscoverItemComponent } from './components/group/group-discover/group-discover-item/group-discover-item.component';
import { GroupDiscoverComponent } from './components/group/group-discover/group-discover.component';
import { GroupFeedComponent } from './components/group/group-feed/group-feed.component';
import { CreateNewGroupComponent } from './components/group/group-general/create-new-group/create-new-group.component';
import { GroupGeneralGroupItemComponent } from './components/group/group-general/group-general-group-item/group-general-group-item.component';
import { GroupGeneralComponent } from './components/group/group-general/group-general.component';
import { GroupMediaComponent } from './components/group/group-media/group-media.component';
import { GroupMemberItemComponent } from './components/group/group-member/group-member-item/group-member-item.component';
import { GroupMemberComponent } from './components/group/group-member/group-member.component';
import { GroupSettingsComponent } from './components/group/group-settings/group-settings.component';
import { GroupCreatePostComponent } from './components/group/group-timeline/group-create-post/group-create-post.component';
import { GroupTimelineComponent } from './components/group/group-timeline/group-timeline.component';
import { GroupComponent } from './components/group/group.component';
import { JoinRequestItemComponent } from './components/group/join-request-list/join-request-item/join-request-item.component';
import { JoinRequestListComponent } from './components/group/join-request-list/join-request-list.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NewsFeedComponent } from './components/news-feed/news-feed.component';
import { NotificationItemComponent } from './components/notification/notif-item/notification-item.component';
import { NotificationComponent } from './components/notification/notification/notification.component';
import { PhotoViewerComponent } from './components/photo-viewer/photo-viewer.component';
import { PhotoViewerPlaceholderComponent } from './components/photo/photo-viewer/photo-viewer-placeholder/photo-viewer-placeholder.component';
import { CreatePostModalComponent } from './components/post/create-post-modal/create-post-modal.component';
import { CreatePostComponent } from './components/post/create-post/create-post.component';
import { GroupShareItemComponent } from './components/post/group-share-selector/group-share-item/group-share-item.component';
import { GroupShareSelectorComponent } from './components/post/group-share-selector/group-share-selector.component';
import { MediaLayoutComponent } from './components/post/media-layout/media-layout.component';
import { PostHeaderComponent } from './components/post/post-header/post-header.component';
import { PostListComponent } from './components/post/post-list/post-list.component';
import { PostNotFoundComponent } from './components/post/post-not-found/post-not-found.component';
import { PostSkeletonComponent } from './components/post/post-skeleton/post-skeleton.component';
import { PostViewComponent } from './components/post/post-view/post-view.component';
import { PostComponent } from './components/post/post.component';
import { SharedContentComponent } from './components/post/shared-content/shared-content.component';
import { FriendListItemComponent } from './components/profile/friend-list/friend-list-item/friend-list-item.component';
import { FriendListComponent } from './components/profile/friend-list/friend-list.component';
import { FriendshipButtonComponent } from './components/profile/friendship-button/friendship-button.component';
import { PhotoListItemComponent } from './components/profile/photo-list/photo-list-item/photo-list-item.component';
import { PhotoListComponent } from './components/profile/photo-list/photo-list.component';
import { PickAvatarComponent } from './components/profile/pick-avatar/pick-avatar.component';
import { ProfileAboutItemComponent } from './components/profile/profile-about/profile-about-item/profile-about-item.component';
import { ProfileAboutComponent } from './components/profile/profile-about/profile-about.component';
import { ProfileTimelineComponent } from './components/profile/profile-timeline/profile-timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { StickySidebarDirective } from './components/profile/sticky-sidebar.directive';
import { TabBarComponent } from './components/profile/tab-bar/tab-bar.component';
import { ByGroupsComponent } from './components/search/by-groups/by-groups.component';
import { ByGroupResultComponent } from './components/search/by-people/by-group-result/by-group-result.component';
import { ByPeopleResultComponent } from './components/search/by-people/by-people-result/by-people-result.component';
import { ByPeopleComponent } from './components/search/by-people/by-people.component';
import { ResultComponent } from './components/search/by-people/result/result.component';
import { ByPostsComponent } from './components/search/by-posts/by-posts.component';
import { SearchComponent } from './components/search/search.component';
import { ButtonComponent } from './components/share/button/button.component';
import { CardHeaderComponent } from './components/share/card-header/card-header.component';
import { ConfirmDialogComponent } from './components/share/confirm-dialog/confirm-dialog.component';
import { LoadOnScrollDirective } from './components/share/load-on-scroll.directive';
import { LoggedInComponent } from './components/share/logged-in/logged-in.component';
import { MessageService } from './components/share/message.service';
import { ModalComponent } from './components/share/modal/modal.component';
import { PhotoComponent } from './components/share/photo/photo.component';
import { PopUpComponent } from './components/share/pop-up/pop-up.component';
import { SirvPipe } from './components/share/sirv.pipe';
import { SpinnerComponent } from './components/share/spinner/spinner.component';
import { SquareImageComponent } from './components/share/square-image/square-image.component';
import { ToasterComponent } from './components/share/toaster/toaster.component';
import { UserRefPopupComponent } from './components/share/user-ref/user-ref-popup/user-ref-popup.component';
import { UserRefComponent } from './components/share/user-ref/user-ref.component';
import { MyReuseStrategy } from './my-reuse-trategy';
import { MyRxStompConfig } from './my-rx-stomp.config';
import { LabelComponent } from './components/share/label/label.component';
import { LabelDirective } from './components/share/label/label.directive';
import { CommentSkeletonComponent } from './components/comment-list/comment-skeleton/comment-skeleton.component';

@NgModule({
  declarations: [
    GroupShareItemComponent,
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
    NotificationItemComponent,
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
    FriendshipButtonComponent,
    ConfirmDialogComponent,
    PopUpComponent,
    StickySidebarDirective,
    TabBarComponent,
    SpinnerComponent,
    ToasterComponent,
    PhotoViewerPlaceholderComponent,
    MediaLayoutComponent,
    SharedContentComponent,
    PostHeaderComponent,
    ModalComponent,
    LoadOnScrollDirective,
    GroupMemberItemComponent,
    GroupShareSelectorComponent,
    CreatePostModalComponent,
    CardHeaderComponent,
    CreateNewGroupComponent,
    GroupGeneralGroupItemComponent,
    PostNotFoundComponent,
    ProfileAboutItemComponent,
    GroupDiscoverComponent,
    GroupDiscoverItemComponent,
    SirvPipe,
    LabelComponent,
    LabelDirective,
    CommentSkeletonComponent,
  ],
  imports: [
    ImageCropperModule,
    PickerModule,
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
    private scroller: ViewportScroller,
  ) {
    let isNavigateSameRoute = true;
    let navigationTrigger = '';
    let scrollOnRouteReuse = true;
    this.router.events.subscribe(e  => {
      if (e instanceof NavigationStart) {
        if (router.url.replace(/\?.*$/g, '') == e.url.replace(/\?.*$/g, '')) {
          navigationTrigger = e.navigationTrigger || '';
          isNavigateSameRoute = true;
        } else {
          isNavigateSameRoute = false;
        }

      } else if (e instanceof NavigationEnd) {
        scrollOnRouteReuse =
          this.router.getCurrentNavigation()?.extras.state?.routeReuseScroll;

        if (!isNavigateSameRoute) {
          this.scroller.scrollToPosition([0, 0]);
        }

        else if (scrollOnRouteReuse !== false && navigationTrigger != 'popstate') {
          window.scrollTo({top: 0, behavior: 'smooth'});
        }
      }
    });
  }
}
