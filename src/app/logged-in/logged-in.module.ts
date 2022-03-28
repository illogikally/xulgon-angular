import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../shared/shared.module";
import {AvatarCoverChangerComponent} from "./avatar-cover-changer/avatar-cover-changer.component";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {PostModule} from "../post/post.module";
import {
  PhotoViewerPlaceholderComponent
} from "./photo-viewer/photo-viewer-placeholder/photo-viewer-placeholder.component";
import {NotificationModule} from "../notification/notification.module";
import {ChatModule} from "../chat/chat.module";
import {ReactiveFormsModule} from "@angular/forms";
import {ImageCropperModule} from "ngx-image-cropper";
import {RouterModule} from "@angular/router";
import {LoggedInComponent} from "./logged-in.component";
import {PostViewModule} from "../post-view/post-view.module";
import {LoggedInRoutingModule} from "./logged-in-routing.module";
import {PhotoViewerComponent} from "./photo-viewer/photo-viewer.component";

@NgModule({
  declarations: [
    AvatarCoverChangerComponent,
    ConfirmDialogComponent,
    NavbarComponent,
    PhotoViewerComponent,
    PhotoViewerPlaceholderComponent,
    LoggedInComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,

    NotificationModule,
    ChatModule,
    ImageCropperModule,
    ReactiveFormsModule,
    PostViewModule,
    PostModule,
    LoggedInRoutingModule
  ],
})
export class LoggedInModule { }
