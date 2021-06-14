import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommentService } from './comment/comment.service';
import { CommentResponse } from './comment/comment-response';
import { FormControl, FormGroup } from '@angular/forms';
import { CommentRequest } from './comment/comment-request';
import { MessageService } from '../common/message.service';
import { AuthenticationService } from '../authentication/authentication.service';

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
  file: Blob | undefined;
  sizeRatio!: number;
  imgUrl!: string;
  
  loggedInUserAvatarUrl: string;


  constructor(private commentService: CommentService,
    private authService: AuthenticationService,
    private messageService: MessageService) { 
      
      this.loggedInUserAvatarUrl = authService.getAuth().avatarUrl;
  }

  ngOnInit(): void {
    this.commentForm = new FormGroup({
      comment: new FormControl(''),
      fileInput: new FormControl('')
    });

    this.commentService.getCommentsByContent(this.contentId).subscribe(resp => {
      this.comments = resp;
    });

    
  }


  submit(): void {
    let formData = new FormData;

    let commentRequest = new Blob([JSON.stringify({
      parentId: this.contentId,
      body: this.commentForm.get('comment')?.value,
      sizeRatio: this.sizeRatio
    })], { type: 'application/json' });
    formData.append('commentRequest', commentRequest);

    formData.append('photo', this.file === undefined ? new Blob() : this.file)

    this.commentService.createComment(formData).subscribe(comment => {
      this.comments.push(comment);
      this.messageService.sendMessage("Comment added");
    });

    this.commentForm.get('comment')?.setValue("");
    this.clearInput();
  }

  onSelectImage(event: any): void {
    if (event.target?.files && event.target.files[0]) {
      this.file = event.target.files[0];
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        let img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          this.sizeRatio = img.width / img.height;
        }

        this.imgUrl = event.target?.result as string;
      }
    }
  }

  clearInput(): void {
    this.imgUrl = '';
    this.file = undefined;
  }

}
