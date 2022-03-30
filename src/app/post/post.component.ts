import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output, Renderer2,
  ViewChild
} from '@angular/core';
import {fromEvent, merge, of, Subject} from 'rxjs';
import {filter, mergeAll, switchMap, take, takeUntil} from 'rxjs/operators';
import {AuthenticationService} from '../core/authentication/authentication.service';
import {CommentListComponent} from './comment-list/comment-list.component';
import {CommentService} from './comment-list/comment/comment.service';
import {GroupResponse} from '../group/group-response';
import {ConfirmDialogService} from '../logged-in/confirm-dialog/confirm-dialog.service';
import {FollowService} from '../shared/services/follow.service';
import {PhotoViewResponse} from '../shared/components/photo/photo-view-response';
import {ReactionType} from '../shared/models/reaction-type';
import {ReactionPayload} from '../shared/models/reaction.payload';
import {ReactionService} from '../shared/services/reaction.service';
import {ToasterMessageType} from '../shared/components/toaster/toaster-message-type';
import {ToasterService} from '../shared/components/toaster/toaster.service';
import {Post} from './post';
import {PostService} from './post.service';
import {PostViewService} from "../post-view/post-view.service";


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
  @ViewChild('reactionCount') reactionCount!: ElementRef;

  principalId = this.authService.getPrincipalId();
  groupResponse!: GroupResponse;
  isShareOptionsHidden = true;
  isTextClamped = false;

  constructor(
    private renderer: Renderer2,
    private toaster: ToasterService,
    private commentService: CommentService,
    private followService: FollowService,
    private reactionService: ReactionService,
    private confirmService: ConfirmDialogService,
    private authService: AuthenticationService,
    private changeDetector: ChangeDetectorRef,
    private postViewService: PostViewService,
    private postService: PostService,
  ) {
  }

  ngOnInit(): void {
    this.commentService.newCommentAdded.pipe(
      filter(msg => msg.parentId == this.post.id)
    ).subscribe(() => this.post.commentCount += 1);
    // this.postViewService.attach$.pipe(
    //   filter(postId => postId == this.post.id),
    //   takeUntil(this.postViewService.detach$.pipe(filter(postId => postId == this.post.id)))
    // ).subscribe(() => this.onAttach());
  }

  onAttach() {

  }

  ngAfterViewInit(): void {
    this.isTextClamped = this.isPostBodyClamped();
    this.changeDetector.detectChanges();
    this.listenOnHighlightReaction();
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

  listenOnHighlightReaction() {
    const attach$ = this.postViewService.attach$
      .pipe(filter(id => id == this.post.id));
    const detach$ = this.postViewService.detach$
      .pipe(filter(id => id == this.post.id));
    const highlight$ = this.postViewService.highlight$.pipe(
      filter(data => !!data),
      filter(data => data.postId == this.post.id),
      filter(data => !data.commentId),
      filter(data => data.type == 'reaction'),
      takeUntil(detach$)
    );
    merge(attach$, of(null))
      .pipe(switchMap(() => highlight$))
      .subscribe(this.highlightReaction.bind(this));
  }

  highlightReaction() {
    const reaction = this.reactionCount.nativeElement;
    this.post.reactionCount = this.post.reactionCount || 1;
    this.renderer.addClass(reaction, 'highlight');
    reaction.scrollIntoView({behavior: 'smooth'});
    fromEvent(window, 'mouseup')
      .pipe(take(1))
      .subscribe(() => this.renderer.removeClass(reaction, 'highlight'));
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
