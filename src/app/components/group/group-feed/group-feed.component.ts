import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../../post/post';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-feed',
  templateUrl: './group-feed.component.html',
  styleUrls: ['./group-feed.component.scss']
})
export class GroupFeedComponent implements OnInit {

  posts: Post[] = [];

  isLoading = false;
  isPostsLoaded = false;
  initPostsSize = 2;
  isAllPostsLoaded = false;
  @ViewChild('postsContainer') postsContainer!: ElementRef;

  constructor(
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    if (
      this.isAllPostsLoaded ||
      this.isLoading
    ) return;

    const size = this.posts.length ? 5 : this.initPostsSize;
    const offset = this.posts.length;

    this.isLoading = true;
    this.groupService.getGroupFeed(size, offset)
      .subscribe(response => {
        this.posts = this.posts.concat(response.data);
        this.isLoading = false;
        this.isPostsLoaded = true;
        if (!response.hasNext) {
          this.isAllPostsLoaded = true;
        }
      });
  }
}
