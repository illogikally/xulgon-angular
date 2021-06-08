import { Component, OnInit, Input } from '@angular/core';
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
export class PostListComponent implements OnInit {

  @Input() pageId!: number;

  @Input() posts!: Array<Post>;

  constructor(private activateRoute: ActivatedRoute,
    private messageService: MessageService,
    private postService: PostService,
      private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    if (!this.posts) {
      this.loadPosts(this.pageId); 
    }
    this.messageService.onCreatedPost().subscribe(post => {
      this.posts.unshift(post);
    });
    this.activateRoute.params.subscribe(params => {
      const id = +params['id'];
      this.loadPosts(id);
    });  
  }

  loadPosts(pageId: number): void {
    this.postService.getPostsByPageId(pageId)
      .subscribe(resp => this.posts = resp);
  }
}
