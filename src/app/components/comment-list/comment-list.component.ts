import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {CommentService} from './comment/comment.service';
import {CommentResponse} from './comment/comment-response';
import {FormControl, FormGroup} from '@angular/forms';
import {MessageService} from '../common/message.service';
import {AuthenticationService} from '../authentication/authentication.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  @Input() contentId!: number;
  @Input() postId!: number;
  comments = new Array<CommentResponse>();
  commentsQueue = new Array<CommentResponse>();

  showComment: boolean = true;
  commentForm!: FormGroup;
  file: Blob | undefined;
  sizeRatio!: number;
  imgUrl!: string;

  loggedInUserAvatarUrl: string;


  constructor(private commentService: CommentService,
              private http: HttpClient,
              private selfRef: ElementRef,
              private authService: AuthenticationService,
              private renderer: Renderer2,
              private message$: MessageService) {
    this.loggedInUserAvatarUrl = authService.getAvatarUrl();
  }

  ngOnInit(): void {
    this.commentForm = new FormGroup({
      comment: new FormControl(''),
      fileInput: new FormControl('')
    });

    this.getComments();

    this.message$.notif.subscribe(msg => {
      if (msg.type == 'comment_id') {
        console.log('comment_id');

        this.http.get<CommentResponse>(`http://localhost:8080/api/comments/${msg.commentId}`)
          .subscribe(comment => {
            this.comments.unshift(comment);
          });
      }
    });
  }

  getComments(): void {
    const limit = this.comments.length ? 5 : 2; 
    const offset = this.comments.length;
    
    this.commentService
        .getCommentsByContent(this.contentId, offset, limit)
        .subscribe(resp => {
          this.comments = this.comments.concat(resp); 
        });
  }

  submit(): void {
    let formData = new FormData;

    console.log(this.postId);

    let commentRequest = new Blob([JSON.stringify({
      parentId: this.contentId,
      postId: this.postId,
      body: this.commentForm.get('comment')?.value,
      sizeRatio: this.sizeRatio
    })], {type: 'application/json'});
    formData.append('commentRequest', commentRequest);

    formData.append('photo', this.file === undefined ? new Blob() : this.file)


    this.commentService.createComment(formData).subscribe(comment => {
      this.comments.push(comment);
      this.message$.sendMessage("Comment added");
    });

    this.commentForm.get('comment')?.setValue("");
    this.clearInput();
  }

  onSelectImage(event: any): void {
    if (event.target?.files && event.target.files[0]) {
      this.file = event.target.files[0];
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
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
