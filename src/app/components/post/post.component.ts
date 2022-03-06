import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { CommentService } from '../comment-list/comment/comment.service';
import { GroupResponse } from '../group/group-response';
import { ConfirmDialogService } from '../share/confirm-dialog/confirm-dialog.service';
import { FollowService } from '../share/follow.service';
import { MessageService } from '../share/message.service';
import { PhotoViewResponse } from '../share/photo/photo-view-response';
import { ReactionType } from '../share/reaction-type';
import { ReactionPayload } from '../share/reaction.payload';
import { ReactionService } from '../share/reaction.service';
import { ToasterMessageType } from '../share/toaster/toaster-message-type';
import { ToasterService } from '../share/toaster/toaster.service';
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

  openCreatePostToShare$ = new Subject<any>();

  principalId: number;
  groupReponse!: GroupResponse;

  constructor(
    private commentService: CommentService,
    private followService: FollowService,
    private reactionService: ReactionService,
    private confirmService: ConfirmDialogService,
    private postService: PostService,
    private authService: AuthenticationService,
    private messageService: MessageService,
    private toaster: ToasterService
  ) {
    this.principalId = authService.getPrincipalId();
  }

  ngOnInit(): void {
    this.messageService.groupLoaded
      .subscribe(group => {
        if (!group) return;
        this.groupReponse = group;
      });

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
  }

  unfollow() {
    this.followService.unfollowContent(this.post.id).subscribe(
      () => {
        this.toaster.message$.next({
          type: ToasterMessageType.SUCCESS,
          message: 'Tắt thông báo thành công'
        }); 
      },
      () => {
        this.toaster.message$.next({
          type: ToasterMessageType.ERROR,
          message: 'Đã xảy ra lỗi trong quá trình tắt thông báo'
        }); 
      }
    );
  }

  follow() {
    this.followService.followContent(this.post.id).subscribe(
      () => {
        this.toaster.message$.next({
          type: ToasterMessageType.SUCCESS,
          message: 'Bật thông báo thành công'
        }); 
      },
      () => {
        this.toaster.message$.next({
          type: ToasterMessageType.ERROR,
          message: 'Đã xảy ra lỗi trong quá trình bật thông báo'
        }); 
      }
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
        });
      }
    })
  }

  share() {
    this.openCreatePostToShare$.next();
  }

}
