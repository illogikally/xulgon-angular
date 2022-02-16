import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from '../share/message.service';
import {Post} from '../post/post';
import {PostService} from '../post/post.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss']
})
export class PostViewComponent implements OnInit {

  @Input() isGroup = false;
  post!: Post;

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    let postId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (isNaN(postId)) return;
    this.postService.getPost(postId).subscribe(post => {
      this.post = post;
    });

    this.isCommentNotif(postId);
  }

  isCommentNotif(postId: number): void {
    let commentId = Number(this.activatedRoute.snapshot.queryParamMap.get('comment_id'));
    if (isNaN(commentId)) return;
    this.messageService.postView$.next({
      type: 'COMMENT_ID',
      postId: postId,
      commentId: commentId
    });
  }

  onAttach() {
    console.log('attach');
    this.messageService.postView$.next({
      type: 'ATTACH'
    })
  }

  onDetach() {
    console.log('detach');
    this.messageService.postView$.next({
      type: 'DETACH'
    })
  }
}

