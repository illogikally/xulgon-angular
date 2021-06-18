import { Component, OnInit, Input, ViewChild, EventEmitter, AfterViewInit} from '@angular/core';
import { ReactionType } from '../common/reaction-type';
import { ReactionPayload } from '../common/reaction.payload';
import { ReactionService } from '../common/reaction.service';
import { Post } from './post';
import { CommentListComponent } from '../comment-list/comment-list.component'
import { MessageService } from '../common/message.service';
import { PhotoResponse } from '../common/photo/photo-response';
import { AuthenticationService } from '../authentication/authentication.service';
import { GroupResponse } from '../group/group-response';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post!: Post | PhotoResponse | any;
  onInputFocus: EventEmitter<boolean> = new EventEmitter();


  showComment: boolean = false;
  isPostOptsVisible = false;

  loggedInUserId: number;

  groupReponse!: GroupResponse;
  

  constructor(private reactionService: ReactionService,
    private authService: AuthenticationService,
    private messageService: MessageService) { 
      this.loggedInUserId = authService.getUserId();
  }

  ngOnInit(): void {
    this.messageService.groupLoaded.subscribe(group => {
      this.groupReponse = group;
    });

    this.messageService.onNewMessge().subscribe(msg => {
      if (msg == "Comment added") {
        this.post.commentCount += 1;
      }
    });
  }


  toggleComment(): void {
    this.showComment = !this.showComment;
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
    this.showComment = true;
    this.onInputFocus.emit(true);
  }


}
