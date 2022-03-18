import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { CommentService } from '../comment-list/comment/comment.service';
import { GroupResponse } from '../group/group-response';
import { ProfileService } from '../profile/profile.service';
import { ConfirmDialogService } from '../share/confirm-dialog/confirm-dialog.service';
import { FollowService } from '../share/follow.service';
import { PhotoViewResponse } from '../share/photo/photo-view-response';
import { ReactionType } from '../share/reaction-type';
import { ReactionPayload } from '../share/reaction.payload';
import { ReactionService } from '../share/reaction.service';
import { Post } from './post';
import { PostService } from './post.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Output() remove = new EventEmitter();
  @Input() post!: Post | PhotoViewResponse;
  @Input() isCommentVisible = false;
  @Input() isGroupNameVisible = false;
  @Input() initCommentCount = 2;

  @ViewChild(CommentListComponent) commentListComponent!: CommentListComponent;
  openCreatePostToShare$ = new Subject<any>();

  principalId = this.authService.getPrincipalId();
  groupReponse!: GroupResponse;
  isShareOptionsHidden = true;

  constructor(
    private commentService: CommentService,
    private followService: FollowService,
    private reactionService: ReactionService,
    private confirmService: ConfirmDialogService,
    private authService: AuthenticationService,
    private postService: PostService,
  ) {
  }

  ngOnInit(): void {
    this.commentService.commentAdded$.pipe(
      filter(msg => msg.parentId == this.post.id)
    ).subscribe(() => this.post.commentCount += 1);
  }

  toggleComment(): void {
    this.isCommentVisible = !this.isCommentVisible;
  }

  react(): void {
    let reaction: ReactionPayload = {
      contentId: this.post.id,
      type: ReactionType.LIKE
    };

    this.reactionService.react(reaction).subscribe(() => {
      this.post.reactionCount += this.post.isReacted ? -1 : 1;
      this.post.isReacted = !this.post.isReacted;
    });
  }

  comment(): void {
    this.isCommentVisible = true;
    this.commentListComponent.focusInput();
  }

  unfollow() {
    this.followService.unfollowContent(this.post.id).subscribe(
      () => this.post.isFollow = false
    );
  }

  follow() {
    this.followService.followContent(this.post.id).subscribe(
      () => this.post.isFollow = true
    );
  }

  delete(): void {
    const data = {
      title: `Xoá bài viết`,
      body: `Bạn có chắc muốn xoá bài viết này?`
    };

    this.confirmService.confirm(data)
    .then(isConfirmed => {
      if (isConfirmed) {
        this.postService.delete(this.post.id).subscribe(() => {
          this.remove.next(this.post.id)
          this.postService.postDeleted$.next(this.post.id);
        });
      }
    })
  }

  shareOnTimeline() {
    this.postService.openCreatePost({
      sharedContent: this.post.sharedContent || this.post
    });
  }

  shareInGroup() {
    const content = this.post.sharedContent || this.post;
    this.postService.openGroupShareSelector(content);
  }

  unfollowPage() {
    this.followService.unfollowPage(this.post.pageId).subscribe(() => {
      this.post.isFollowPage = false;
    });
  }
}
