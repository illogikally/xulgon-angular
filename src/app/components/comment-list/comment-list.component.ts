import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommentService } from './comment/comment.service';
import { CommentResponse } from './comment/comment-response';
import { FormControl, FormGroup } from '@angular/forms';
import { CommentRequest } from './comment/comment-request';
import { MessageService } from '../common/message.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  @Input() contentId!: number;

  @Input() comments!: CommentResponse[];
  showComment: boolean = true;
  commentForm!: FormGroup; 

  constructor(private commentService: CommentService,
    private messageService: MessageService) { 

  }

  ngOnInit(): void {
    this.commentForm = new FormGroup({
      comment: new FormControl('')
    });

    this.commentService.getCommentsByContent(this.contentId).subscribe(resp => {
      this.comments = resp;
    });

    
  }


  submit(): void {
    let commentRequest: CommentRequest = {
      parentId: this.contentId,
      body: this.commentForm.get('comment')?.value
    }

    this.commentService.createComment(commentRequest).subscribe(comment => {
      this.comments.push(comment);
      this.messageService.sendMessage("Comment added");
    });

    this.commentForm.get('comment')?.setValue("");
  }
}
