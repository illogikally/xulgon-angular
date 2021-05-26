import { Component, OnInit, Input } from '@angular/core';
import { CommentResponse } from './comment-response'

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() myComment!: CommentResponse;
  userProfile!: string;
  showReply: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.userProfile = `/${this.myComment.userId}`
    console.log(this.myComment.parentType);
    
    
  }

  showReplyOnClick(): void {
    this.showReply = true;
  }

}
