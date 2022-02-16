import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {CommentService} from './comment/comment.service';
import {CommentResponse} from './comment/comment-response';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MessageService} from '../share/message.service';
import {AuthenticationService} from '../authentication/authentication.service';
import {HttpClient} from '@angular/common/http';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit, OnDestroy {

  @Input() targetId!: number;
  @Input() parentId!: number;
  @Input() isPostView = false;

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

  onDestroy$ = new ReplaySubject<any>();
  onAttach$ = this.messageService.postView$.pipe(
    filter(message => message.type == 'ATTACH')
  );

  onDetach$ = this.messageService.postView$.pipe(
    filter(message => message.type == 'DETACH')
  )


  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  constructor(
    private commentService: CommentService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.loggedInUserAvatarUrl = this.authService.getAvatarUrl();
  }

  ngOnInit() {
    this.getComments();

    if (this.isPostView) {
      const commentId = Number(this.route.snapshot.queryParamMap.get('comment_id'));
      if (isNaN(commentId) || this.commentIdSet.has(commentId)) return;
      this.commentService.getComment(commentId)
        .subscribe(comment => {
          this.commentIdSet.add(comment.id);
          this.comments.unshift(comment);
        });
    }
  }

  getComments() {
    const limit = this.comments.length ? 5 : 2;
    const offset = this.comments.length;

    this.commentService
      .getCommentsByContent(this.targetId, offset, limit)
      .subscribe(resp => {
        resp = resp.filter(comment => {
          if (!this.commentIdSet.has(comment.id)) {
            this.commentIdSet.add(comment.id);
            return true;
          }
          return false;
        });
        this.comments = this.comments.concat(resp);
      });
  }

  submit() {
    let formData = new FormData();
    let commentRequest = new Blob(
      [JSON.stringify({
        parentId: this.targetId,
        postId: this.parentId,
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
        parentId: this.targetId
      });
    });

    this.commentForm.get('comment')?.setValue("");
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
