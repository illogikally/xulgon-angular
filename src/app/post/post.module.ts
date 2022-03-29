import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommentListComponent} from "./comment-list/comment-list.component";
import {CommentComponent} from "./comment-list/comment/comment.component";
import {CommentSkeletonComponent} from "./comment-list/comment-skeleton/comment-skeleton.component";
import {GroupShareSelectorComponent} from "./group-share-selector/group-share-selector.component";
import {GroupShareItemComponent} from "./group-share-selector/group-share-item/group-share-item.component";
import {MediaLayoutComponent} from "./media-layout/media-layout.component";
import {PostHeaderComponent} from "./post-header/post-header.component";
import {PostListComponent} from "./post-list/post-list.component";
import {PostNotFoundComponent} from "./post-not-found/post-not-found.component";
import {PostSkeletonComponent} from "./post-skeleton/post-skeleton.component";
import {SharedModule} from "../shared/shared.module";
import {SharedContentComponent} from "./shared-content/shared-content.component";
import {CreatePostModalComponent} from "./create-post-modal/create-post-modal.component";
import {CreatePostComponent} from "./create-post/create-post.component";
import {PostComponent} from "./post.component";
import {RouterModule} from "@angular/router";
import {PickerModule} from "@ctrl/ngx-emoji-mart";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ContentUrlPipe } from './pipes/content-url.pipe';

@NgModule({
  declarations: [
    CommentListComponent,
    CommentComponent,
    CommentSkeletonComponent,
    GroupShareSelectorComponent,
    GroupShareItemComponent,
    PostComponent,
    MediaLayoutComponent,
    CreatePostModalComponent,
    CreatePostComponent,
    PostHeaderComponent,
    PostListComponent,
    PostNotFoundComponent,
    PostSkeletonComponent,
    SharedContentComponent,
    ContentUrlPipe
  ],
  imports: [
    SharedModule,
    PickerModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
  ],
  exports: [
    PostSkeletonComponent,
    CreatePostComponent,
    GroupShareSelectorComponent,
    CreatePostModalComponent,
    PostNotFoundComponent,
    PostComponent,
    PostListComponent
  ]
})
export class PostModule { }
