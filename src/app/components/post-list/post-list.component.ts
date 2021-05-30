import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../post/post.service'
import { Post } from '../post/post'
import { AuthenticationService } from '../authentication/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  @Input() pageId!: number;

  posts: Array<Post> = new Array();
  constructor(private postService: PostService,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {

    
    this.postService.getPostsByPageId(this.pageId)
      .subscribe(resp => this.posts = resp);
  }

}
