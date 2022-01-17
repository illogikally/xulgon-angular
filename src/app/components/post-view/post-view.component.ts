import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from '../common/message.service';
import {Post} from '../post/post';
import {PostService} from '../post/post.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss']
})
export class PostViewComponent implements OnInit {

  post!: Post;

  constructor(private activatedRoute: ActivatedRoute,
              private message$: MessageService,
              private post$: PostService) {
  }

  ngOnInit(): void {
    let postId = this.activatedRoute.snapshot.paramMap.get('id');
    if (postId == null || !/\d+/g.test(postId)) return;
    this.post$.getPost(postId as unknown as number).subscribe(post => {
      this.post = post;
    });

    this.isCommentNotif();

  }

  isCommentNotif(): void {
    let commentId = this.activatedRoute.snapshot.queryParamMap.get('comment_id');
    if (commentId == null || !/\d+/g.test(commentId)) return;
    this.message$.notif.next({
      type: 'comment_id',
      commentId: commentId
    });
  }
}

