import { Component, OnInit, Input } from '@angular/core';
import { ReactionType } from '../../common/reaction-type';
import { ReactionPayload } from '../../common/reaction.payload';
import { ReactionService } from '../../common/reaction.service';
import { CommentResponse } from './comment-response'
import { CommentService } from './comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() myComment!: CommentResponse;
  userProfile!: string;
  showReply: boolean = false;

  constructor(private reactionService: ReactionService) { }

  ngOnInit(): void {
    this.userProfile = `/${this.myComment.userId}`;
  }

  showReplyOnClick(): void {
    this.showReply = true;
  }

  like(): void {
    
    let reaction: ReactionPayload = {
      type: ReactionType.LIKE,
      contentId: this.myComment.id
    };
    this.reactionService.react(reaction).subscribe(resp => {
      if (this.myComment.isReacted) {
        this.myComment.reactionCount -= 1;
        this.myComment.isReacted = false;
        return;
      }
      this.myComment.reactionCount += 1;
      this.myComment.isReacted = true;
    });
  }

}
