import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PostService } from '../post/post.service'
import { Post } from '../post/post'
import { AuthenticationService } from '../authentication/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../common/message.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  @Input() pageId!: number;
  @Input() posts!: Array<Post>;

  constructor(private activateRoute: ActivatedRoute,
    private messageService: MessageService,
    private postService: PostService,
    private authenticationService: AuthenticationService) {
  }

  ngOnDestroy(): void {
    // this.posts = [];
  }

  ngOnInit(): void {

    this.messageService.pageId.subscribe(id => {
      this.loadPosts(id);
    });

    this.messageService.onCreatedPost().subscribe(post => {
      this.posts.unshift(post);
    });
  }

  loadPosts(pageId: number): void {
    if (!pageId) return;

    this.postService.getPostsByPageId(pageId)
      .subscribe(posts => {
        this.posts = posts;
      });
      
  }
}
