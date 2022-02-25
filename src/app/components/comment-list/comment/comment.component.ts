import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { concat, merge, of, ReplaySubject, Subject } from 'rxjs';
import { filter, pluck, switchMap, takeUntil, throttleTime } from 'rxjs/operators';
import { PostViewService } from '../../post/post-view/post-view.service';
import { MessageService } from '../../share/message.service';
import {ReactionType} from '../../share/reaction-type';
import {ReactionPayload} from '../../share/reaction.payload';
import {ReactionService} from '../../share/reaction.service';
import {CommentResponse} from './comment-response'

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, AfterViewInit {

  @Input() comment!: CommentResponse;
  @Input() replyVisible = false;
  @Output() onCommentAdded: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('commentBody') commentBodyElement!: ElementRef;

  userProfile!: string;

  onAttach$ = this.postViewService.attach$.pipe(
    filter(postId => postId == this.comment.rootContentId)
  );

  onDetach$ = this.postViewService.detach$.pipe(
    filter(postId => postId == this.comment.rootContentId)
  );

  constructor(
    private renderer: Renderer2,
    private reactionService: ReactionService,
    private postViewService: PostViewService,
    private changeDetector: ChangeDetectorRef,
    private route:ActivatedRoute,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.userProfile = `/${this.comment.user.profileId}`;
  }

  setupOnHighlight() {
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
        }
      }
      else if (data.childCommentId == this.comment.id) {
        this.highlight();
      }
    });
  }

  highlight() {
    const comment = this.commentBodyElement.nativeElement;
    // Prevent click outside
    setTimeout(() => {
      this.renderer.addClass(comment, 'highlight')
    }, 100);

    // Wait for element to be attached to the DOM
    setTimeout(() => {
      comment.scrollIntoView({behavior: 'smooth', block: 'center'});
    }, 500);
  }


  ngAfterViewInit(): void {
    this.setupOnHighlight();
    this.changeDetector.detectChanges();
  }

  showReplies(): void {
    this.replyVisible = true;
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

}
