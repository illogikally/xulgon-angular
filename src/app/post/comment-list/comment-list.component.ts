import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {RxStompService} from '@stomp/ng2-stompjs';
import {merge, of} from 'rxjs';
import {filter, switchMap, takeUntil} from 'rxjs/operators';
import {PostViewService} from '../../post-view/post-view.service';
import {PrincipalService} from '../../shared/services/principal.service';
import {CommentResponse} from './comment/comment-response';
import {CommentService} from './comment/comment.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  @Input() parentId!: number;
  @Input() totalCommentCount!: number;
  @Input() rootContentId!: number;
  @Input() initCommentCount = 2;


  @ViewChild('commentContainer') commentContainer!:ElementRef;
  @ViewChild('textArea') textArea!: ElementRef;

  isAllLoaded = false;
  isInitLoaded = false;
  isLoading = false;
  comments: CommentResponse[] = [];
  commentIdSet = new Set();

  isCommentsVisible = true;
  isSuggestTagUserHidden = true;
  isPostingComment = false;

  commentForm = this.fb.group({
    comment: [''],
    fileInput: ['']
  });

  parentIdCommentsMap = new Map();

  image: Blob | undefined;
  imageSizeRatio!: number;
  imgUrl!: string;

  principalAvatarUrl = '';

  onAttach$ = this.postViewService.attach$.pipe(filter(id => id == this.rootContentId));
  onDetach$ = this.postViewService.detach$.pipe(filter(id => id == this.rootContentId));

  highlightedCommentId!: number;
  ngOnDestroy() {
  }

  constructor(
    private postViewService: PostViewService,
    private commentService: CommentService,
    private principalService: PrincipalService,
    private rxStompService: RxStompService,
    private fb: FormBuilder,

  ) {
  }

  async ngOnInit() {
    this.configureOnHighlightComment();
    this.listenToWebSocketNewComment();
    this.principalAvatarUrl = await this.principalService.getAvatarUrl();
  }

  ngAfterViewInit(): void {
    this.onInputValueChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.configureOnParentIdChange(changes);
  }

  configureOnParentIdChange(changes: SimpleChanges) {
    if (changes.parentId) {
      const currentParentId = changes.parentId.currentValue;
      const previousParenId = changes.parentId.previousValue;
      this.parentIdCommentsMap.set(previousParenId, this.comments);
      if (this.parentIdCommentsMap.has(currentParentId)) {
        this.comments = this.parentIdCommentsMap.get(currentParentId);
      } else {
        this.comments = [];
        this.isInitLoaded = false;
        this.commentIdSet = new Set();
        this.loadComments();
      }
    }
  }

  configureOnHighlightComment() {
    merge(
      this.onAttach$,
      of(null)
    ).pipe(
      switchMap(() => this.postViewService.highlight$.pipe(
        filter(data => !!data),
        filter(data => [data.postId, data.commentId].includes(this.parentId)),
        takeUntil(this.onDetach$))
      )
    ).subscribe(data => {
      this.initCommentCount = 15;

      if (data.postId == this.parentId) {
        this.highlightedCommentId = data.commentId;
      } else {
        this.highlightedCommentId = data.childCommentId;
      }

      this.loadHighlightedComment();
    })
  }

  loadHighlightedComment() {
    if (this.highlightedCommentId) {
      if (!this.commentIdSet.has(this.highlightedCommentId)) {
        this.loadComments();
      }
    }
  }

  loadComments() {
    const limit = this.isInitLoaded ? 5 : this.initCommentCount;
    const offset = this.comments.length;
    if (!limit && !offset) return;
    this.isLoading = true;

    this.commentService
      .getCommentsByContent(this.parentId, offset, limit)
      .subscribe(response => {
        let resp = response.data.filter(comment => {
          if (!this.commentIdSet.has(comment.id)) {
            this.commentIdSet.add(comment.id);
            return true;
          }
          return false;
        });

        this.isAllLoaded = !response.hasNext;
        this.isInitLoaded = true;
        this.isLoading = false;
        this.comments = this.comments.concat(resp);
        this.loadHighlightedComment();
      });
  }

  submit(enterPressedEvent: any) {
    enterPressedEvent.preventDefault();
    this.isPostingComment = true;
    let formData = new FormData();
    let commentRequest = new Blob(
      [JSON.stringify({
        parentId: this.parentId,
        rootContentId: this.rootContentId,
        body: this.commentForm.get('comment')?.value,
      })],
      {type: 'application/json'}
    );
    formData.append('commentRequest', commentRequest);
    formData.append('photo', !this.image ? new Blob() : this.image)


    this.commentService.createComment(formData).subscribe(() => {
      this.isPostingComment = false;
    });

    this.commentForm.reset();
    this.clearInput();
  }

  onSelectImage(event: any) {
    if (event.target?.files && event.target.files[0]) {
      this.image = event.target.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
        let img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          this.imageSizeRatio = img.width / img.height;
        }

        this.imgUrl = event.target?.result as string;
      }
    }
  }

  clearInput() {
    this.imgUrl = '';
    this.image = undefined;
    this.textAreaAutoGrow({target: this.textArea.nativeElement})
  }

  onInputValueChange() {
  }

  textAreaAutoGrow(event: any) {
    event.target.style.height = 'auto';
    event.target.style.height = event.target.scrollHeight + "px";
  }

  onCommentDeleted(id: number) {
    this.comments = this.comments.filter(comment => comment.id != id);
  }

  focusInput() {
    this.textArea.nativeElement.focus();
  }

  listenToWebSocketNewComment() {
    this.rxStompService.watch('/topic/comment').subscribe(message => {
      const dto = JSON.parse(message.body);
      if (dto.type == 'COMMENT' && dto.parentId == this.parentId) {
        if (!this.commentIdSet.has(dto.content.id)) {
          this.comments.push(dto.content);
          this.commentIdSet.add(dto.content.id)
          this.commentService.newCommentAdded.next({
            parentId: this.parentId
          });
        }
      }
    });
  }
}

