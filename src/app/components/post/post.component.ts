import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {ReactionType} from '../share/reaction-type';
import {ReactionPayload} from '../share/reaction.payload';
import {ReactionService} from '../share/reaction.service';
import {Post} from './post';
import {MessageService} from '../share/message.service';
import {PhotoViewResponse} from '../share/photo/photo-view-response';
import {AuthenticationService} from '../authentication/authentication.service';
import {GroupResponse} from '../group/group-response';
import {HttpClient} from '@angular/common/http';
import { CommentService } from '../comment-list/comment/comment.service';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post!: Post | PhotoViewResponse | any;
  onInputFocus: EventEmitter<boolean> = new EventEmitter();

  @Input() isCommentVisible = false;
  @Input() isGroupNameVisible!: boolean;
  @Input() isPostView = false;

  isPostOptsVisible = false;
  principalId: number;
  groupReponse!: GroupResponse;


  constructor(
    private commentService: CommentService,
    private reactionService: ReactionService,
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

    // if (this.isGroupNameVisible) {
    //   this.isCommentVisible = !this.isCommentVisible;
    // }

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

    this.reactionService.react(reaction).subscribe(resp => {
      this.post.reactionCount += this.post.isReacted ? -1 : 1;
      this.post.isReacted = !this.post.isReacted;
    });
  }

  comment(): void {
    this.isCommentVisible = true;
    this.onInputFocus.emit(true);
  }

  delete(): void {
    this.http.delete(`http://localhost:8080/api/posts/${this.post.id}`).subscribe(_ => {
      this.messageService.postDeleted.next(this.post.id);
    });
  }

  hasOptions(): boolean {
    const canDelete = this.post.user.id == this.principalId || this.groupReponse?.role == 'ADMIN';
    return canDelete;
  }
}
