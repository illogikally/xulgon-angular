import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommentService} from './comment/comment.service';
import {CommentResponse} from './comment/comment-response';
import {FormBuilder} from '@angular/forms';
import {MessageService} from '../share/message.service';
import {AuthenticationService} from '../authentication/authentication.service';
import {filter, switchMap, takeUntil} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {concat, merge, of, ReplaySubject} from 'rxjs';
import { PostViewService } from '../post/post-view/post-view.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit, OnDestroy {

  @Input() parentId!: number;
  @Input() totalCommentCount!: number;
  @Input() rootContentId!: number;
  @Input() initCommentCount = 2;


  @ViewChild('commentContainer') commentContainer!:ElementRef;
  highlight$ = new ReplaySubject<number>(1);

  isAllLoaded = false;
  comments: CommentResponse[] = [];
  commentIdSet = new Set();
  isCommentsVisible = true;

  commentForm = this.fb.group({
    comment: [''],
    fileInput: ['']
  });

  image: Blob | undefined;
  imageSizeRatio!: number;
  imgUrl!: string;

  loggedInUserAvatarUrl: string;

  onAttach$ = this.postViewService.attach$.pipe(filter(id => id == this.rootContentId));
  onDetach$ = this.postViewService.detach$.pipe(filter(id => id == this.rootContentId));

  highlightedCommentId!: number;
  ngOnDestroy() {
  }

  constructor(
    private postViewService: PostViewService,
    private commentService: CommentService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.loggedInUserAvatarUrl = this.authService.getAvatarUrl();
  }

  ngOnInit() {
    this.setupOnHighlightComment();
    this.getComments();
  }

  setupOnHighlightComment() {
    merge(
      this.onAttach$,
      of(null)
    ).pipe(
      switchMap(() => this.postViewService.highlight$.pipe(
        filter(data => !!data),
        filter(data => data.postId == this.parentId || data.commentId == this.parentId),
        takeUntil(this.onDetach$))
      )
    ).subscribe(data => {
      this.initCommentCount = 15;

      if (data.postId == this.parentId) {
        this.highlightedCommentId = data.commentId;
      }
      else {
        this.highlightedCommentId = data.childCommentId;
      }
    })
  }

  getComments() {
    const limit = this.comments.length >= this.initCommentCount ? 5 : this.initCommentCount;
    const offset = this.comments.length;

    this.commentService
      .getCommentsByContent(this.parentId, offset, limit)
      .subscribe(response => {
        let resp = response.data;
        resp = resp.filter(comment => {
          if (!this.commentIdSet.has(comment.id)) {
            this.commentIdSet.add(comment.id);
            return true;
          }
          return false;
        });
        this.isAllLoaded = !response.hasNext;
        this.comments = this.comments.concat(resp);

        console.log(this.highlightedCommentId);
        
        if (this.highlightedCommentId) {
          if (!this.commentIdSet.has(this.highlightedCommentId)) {
            this.getComments();
          }
        }
      });
  }

  submit() {
    let formData = new FormData();
    let commentRequest = new Blob(
      [JSON.stringify({
        parentId: this.parentId,
        rootContentId: this.rootContentId,
        body: this.commentForm.get('comment')?.value,
        sizeRatio: this.imageSizeRatio
      })],
      {type: 'application/json'}
    );
    formData.append('commentRequest', commentRequest);
    formData.append('photo', !this.image ? new Blob() : this.image)


    this.commentService.createComment(formData).subscribe(comment => {
      this.comments.push(comment);
      this.commentService.commentAdded$.next({
        parentId: this.parentId
      });
    });

    this.commentForm.get('comment')?.setValue('');
    this.clearInput();
  }

  onSelectImage(event: any) {
    if (event.target?.files && event.target.files[0]) {
      this.image = event.target.files[0];
      var reader = new FileReader();

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
  }
}
