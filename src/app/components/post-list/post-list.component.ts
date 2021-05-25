import { Component, OnInit } from '@angular/core';
import { PostService } from './post/post.service'
import { Post } from './post/post'
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  posts: Array<Post> = new Array();
  constructor(private postService: PostService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {

    
    this.postService.getPostsByPageId(1)
      .subscribe(resp => this.posts = resp);
  }

}
