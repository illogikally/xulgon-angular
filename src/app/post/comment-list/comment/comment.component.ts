import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {fromEvent, merge, of} from 'rxjs';
import {filter, switchMap, take, takeUntil} from 'rxjs/operators';
import {AuthenticationService} from '../../../core/authentication/authentication.service';
import {PostViewService} from '../../../post-view/post-view.service';
import {ConfirmDialogService} from '../../../logged-in/confirm-dialog/confirm-dialog.service';
import {ReactionType} from '../../../shared/models/reaction-type';
import {ReactionPayload} from '../../../shared/models/reaction.payload';
import {ReactionService} from '../../../shared/services/reaction.service';
import {ToasterMessageType} from '../../../shared/components/toaster/toaster-message-type';
import {ToasterService} from '../../../shared/components/toaster/toaster.service';
import {CommentListComponent} from '../comment-list.component';
import {CommentResponse} from './comment-response';
import {CommentService} from './comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, AfterViewInit {

  @Input() comment!: CommentResponse;
  @Input() replyVisible = false;
  @Output() onCommentAdded: EventEmitter<boolean> = new EventEmitter();
  @Output() deleted = new EventEmitter<number>();

  @ViewChild('commentBody') commentBodyElement!: ElementRef;
  @ViewChild(CommentListComponent) commentListComponent!: CommentListComponent;

  principalId = this.authenticationService.getPrincipalId();

  onAttach$ = this.postViewService.attach$.pipe(
    filter(postId => postId == this.comment.rootContentId)
  );

  onDetach$ = this.postViewService.detach$.pipe(
    filter(postId => postId == this.comment.rootContentId)
  );

  constructor(
    private confirmService: ConfirmDialogService,
    private renderer: Renderer2,
    private reactionService: ReactionService,
    private toasterService: ToasterService,
    private rxStompService: RxStompService,
    private postViewService: PostViewService,
    private changeDetector: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private commentService: CommentService
  ) {
  }

  ngOnInit(): void {
    this.listenToWebSocketNewComment();
  }

  ngAfterViewInit(): void {
    this.configureOnHighlight();
    this.changeDetector.detectChanges();
  }

  configureOnHighlight() {
    merge(
      this.onAttach$,
      of(null)
    ).pipe(
      switchMap(() => this.postViewService.highlight$.pipe(
        filter(data => !!data),
        filter(data => data.postId == this.comment.rootContentId),
        takeUntil(this.onDetach$)
      ))
    ).subscribe(data => {
      if (data.commentId == this.comment.id) {
        if (data.childCommentId) {
          this.replyVisible = true;
        } else {
          this.highlight();
          this.scrollToView();
        }
      }
      else if (data.childCommentId == this.comment.id) {
        this.highlight();
        this.scrollToView();
      }
    });
  }

  highlight() {
    const comment = this.commentBodyElement.nativeElement;
    this.renderer.addClass(comment, 'highlight');
    fromEvent(document, 'mouseup')
      .pipe(take(1))
      .subscribe(() => this.renderer.removeClass(comment, 'highlight'));
  }

  scrollToView() {
    const comment = this.commentBodyElement.nativeElement;
    // Wait for the element to be attached to the DOM
    setTimeout(() => {
      comment.scrollIntoView({behavior: 'smooth', block: 'center'});
    }, 500);
  }



  showReplies(): void {
    this.replyVisible = true;
    setTimeout(() => {
      this.commentListComponent.focusInput();
    }, 100);
  }

  like(): void {
    let reaction: ReactionPayload = {
      type: ReactionType.LIKE,
      contentId: this.comment.id
    };

    this.reactionService.react(reaction).subscribe(resp => {
      if (this.comment.isReacted) {
        this.comment.reactionCount -= 1;
        this.comment.isReacted = false;
        return;
      }
      this.comment.reactionCount += 1;
      this.comment.isReacted = true;
    });
  }

  commentAdded(): void {
    this.onCommentAdded.emit(true);
  }

  async delete() {
    const isConfirmed = await this.confirmService.confirm({
      title: 'Xo?? b??nh lu???n',
      body: 'B???n c?? ch???c mu???n xo?? b??nh lu???n n??y?'
    });

    if (isConfirmed) {
      this.commentService.delete(this.comment.id).subscribe(() => {
        this.deleted.next(this.comment.id);
        this.toasterService.message$.next({
          type: ToasterMessageType.SUCCESS,
          message: 'Xo?? b??nh lu???n th??nh c??ng.'
        })
      }, () => {
        this.toasterService.message$.next({
          type: ToasterMessageType.ERROR,
          message: '???? c?? l???i, xo?? b??nh lu???n th???t b???i.'
        })
      })
    }
  }

  listenToWebSocketNewComment() {
    this.rxStompService.watch('/topic/comment').subscribe(message => {
      const dto = JSON.parse(message.body);
      if (dto.type == 'COMMENT' && dto.parentId == this.comment.id) {
        this.comment.replyCount += 1;
      }
    });
  }
}
