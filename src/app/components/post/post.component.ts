import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {AuthenticationService} from '../authentication/authentication.service';
import {CommentListComponent} from '../comment-list/comment-list.component';
import {CommentService} from '../comment-list/comment/comment.service';
import {GroupResponse} from '../group/group-response';
import {ConfirmDialogService} from '../share/confirm-dialog/confirm-dialog.service';
import {FollowService} from '../share/follow.service';
import {PhotoViewResponse} from '../share/photo/photo-view-response';
import {ReactionType} from '../share/reaction-type';
import {ReactionPayload} from '../share/reaction.payload';
import {ReactionService} from '../share/reaction.service';
import {ToasterMessageType} from '../share/toaster/toaster-message-type';
import {ToasterService} from '../share/toaster/toaster.service';
import {Post} from './post';
import {PostService} from './post.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, AfterViewInit {

  @Output() remove = new EventEmitter();
  @Input() post!: Post | PhotoViewResponse;
  @Input() isCommentVisible = false;
  @Input() isGroupNameVisible = false;
  @Input() initCommentCount = 2;

  @ViewChild(CommentListComponent) commentListComponent!: CommentListComponent;
  @ViewChild('postBodyText') postBodyText!: ElementRef;
  openCreatePostToShare$ = new Subject<any>();

  principalId = this.authService.getPrincipalId();
  groupReponse!: GroupResponse;
  isShareOptionsHidden = true;
  isTextClamped = false;

  constructor(
    private toaster: ToasterService,
    private commentService: CommentService,
    private followService: FollowService,
    private reactionService: ReactionService,
    private confirmService: ConfirmDialogService,
    private authService: AuthenticationService,
    private changeDetector: ChangeDetectorRef,
    private postService: PostService,
  ) {
  }

  ngOnInit(): void {
    this.commentService.commentAdded$.pipe(
      filter(msg => msg.parentId == this.post.id)
    ).subscribe(() => this.post.commentCount += 1);
  }

  ngAfterViewInit(): void {
    this.isTextClamped = this.isPostBodyClamped();
    this.changeDetector.detectChanges();
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
    setTimeout(() => {
      this.commentListComponent.focusInput();
    }, 200);
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

  async delete() {
    const data = {
      title: `Xoá bài viết`,
      body: `Bạn có chắc muốn xoá bài viết này?`
    };

    const isConfirmed = await this.confirmService.confirm(data);
    if (isConfirmed) {
      this.postService.delete(this.post.id).subscribe(() => {
        this.remove.next(this.post.id);
        this.postService.postDeleted$.next(this.post.id);
        this.toaster.message$.next({
          type: ToasterMessageType.SUCCESS,
          message: 'Xoá bài viết thành công'
        })
      }, () => this.toaster.message$.next({
        type: ToasterMessageType.ERROR,
        message: 'Đã có lỗi, xoá bài viết không thành công'
      }));
    }
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

  isPostBodyClamped() {
    const body = this.postBodyText.nativeElement;
    return body.scrollHeight > body.clientHeight;
  }

  unclampText() {
    this.postBodyText.nativeElement.style.display = 'block';
    this.isTextClamped = false;
  }
}
