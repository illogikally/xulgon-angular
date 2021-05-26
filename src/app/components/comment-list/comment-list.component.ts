import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from './comment/comment.service';
import { CommentResponse } from './comment/comment-response';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  @Input() contentId!: number;
  comments!: CommentResponse[];
  showComment: boolean = false;
  commentForm!: FormGroup; 
  constructor(private commentService: CommentService) { 

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
    console.log(this.commentForm.get('comment')?.value);
  }
}
