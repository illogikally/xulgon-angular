import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReactionType} from '../share/reaction-type';
import {ReactionPayload} from '../share/reaction.payload';
import {ReactionService} from '../share/reaction.service';
import {Post} from './post';
import {MessageService} from '../share/message.service';
import {PhotoViewResponse} from '../share/photo/photo-view-response';
import {AuthenticationService} from '../authentication/authentication.service';
import {GroupResponse} from '../group/group-response';
import {HttpClient} from '@angular/common/http';
import {CommentService} from '../comment-list/comment/comment.service';
import {filter} from 'rxjs/operators';
import {PostService} from './post.service';
import {ConfirmDialogService} from '../share/confirm-dialog/confirm-dialog.service';


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

  principalId: number;
  groupReponse!: GroupResponse;


  constructor(
    private commentService: CommentService,
    private reactionService: ReactionService,
    private confirmService: ConfirmDialogService,
    private postService: PostService,
    private http: HttpClient,
    private authService: AuthenticationService,
    private messageService: MessageService
  ) {
    this.principalId = authService.getPrincipalId();
  }

  ngOnInit(): void {
    this.messageService.groupLoaded
      .subscribe(group => {
        if (!group) return;
        this.groupReponse = group;
      });

    console.log(this.post);
      
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

  hasOptions(): boolean {
    const canDelete = 
      this.post.user.id == this.principalId || 
      this.groupReponse?.role == 'ADMIN';
    return canDelete;
  }
}
