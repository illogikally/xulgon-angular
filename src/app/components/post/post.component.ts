import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {ReactionType} from '../common/reaction-type';
import {ReactionPayload} from '../common/reaction.payload';
import {ReactionService} from '../common/reaction.service';
import {Post} from './post';
import {MessageService} from '../common/message.service';
import {PhotoViewResponse} from '../common/photo/photo-view-response';
import {AuthenticationService} from '../authentication/authentication.service';
import {GroupResponse} from '../group/group-response';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post!: Post | PhotoViewResponse | any;
  onInputFocus: EventEmitter<boolean> = new EventEmitter();


  @Input() showComment: boolean = false;
  @Input() showGroup!: boolean;

  isPostOptsVisible = false;
  loggedInUserId: number;
  groupReponse!: GroupResponse;


  constructor(private reactionService: ReactionService,
              private http: HttpClient,
              private authService: AuthenticationService,
              private messageService: MessageService) {
    this.loggedInUserId = authService.getUserId();
  }

  ngOnInit(): void {
    this.messageService.groupLoaded
      .subscribe(group => {
        if (!group) return;
        this.groupReponse = group;
      });

    console.log(this.showGroup, 'group response')

    if (this.showGroup) {
      this.showComment = !this.showComment;
    }

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

  delete(): void {
    this.http.delete(`http://localhost:8080/api/posts/${this.post.id}`).subscribe(_ => {
      this.messageService.postDeleted.next(this.post.id);
    });
  }


}
