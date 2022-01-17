import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReactionType} from '../../common/reaction-type';
import {ReactionPayload} from '../../common/reaction.payload';
import {ReactionService} from '../../common/reaction.service';
import {CommentResponse} from './comment-response'

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() commentResponse!: CommentResponse;
  @Output() onCommentAdded: EventEmitter<boolean> = new EventEmitter;

  userProfile!: string;
  isRepliesVisible: boolean = false;

  constructor(private reactionService: ReactionService) {
  }

  ngOnInit(): void {
    this.userProfile = `/${this.commentResponse.user.profileId}`;
  }

  showReplies(): void {
    this.isRepliesVisible = true;
  }

  like(): void {

    let reaction: ReactionPayload = {
      type: ReactionType.LIKE,
      contentId: this.commentResponse.id
    };

    this.reactionService.react(reaction).subscribe(resp => {
      if (this.commentResponse.isReacted) {
        this.commentResponse.reactionCount -= 1;
        this.commentResponse.isReacted = false;
        return;
      }
      this.commentResponse.reactionCount += 1;
      this.commentResponse.isReacted = true;
    });
  }

  commentAdded(): void {
    this.onCommentAdded.emit(true);
  }

}
