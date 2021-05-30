import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ReactionType } from '../common/reaction-type';
import { ReactionPayload } from '../common/reaction.payload';
import { ReactionService } from '../common/reaction.service';
import { Post } from './post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post!: Post;
  onInputFocus: EventEmitter<boolean> = new EventEmitter();
  showComment: boolean = false;

  constructor(private reactionService: ReactionService) { }

  ngOnInit(): void {
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
      if (this.post.isReacted) {
        this.post.reactionCount -= 1;
        this.post.isReacted = false;
        return;
      }
      this.post.reactionCount += 1;
      this.post.isReacted = true;
    });
  }

  comment(): void {
    this.showComment = true;
    this.onInputFocus.emit(true);
  }

}
