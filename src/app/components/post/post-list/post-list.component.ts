import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  @Input() pageId?: number;
  @Input() posts: Post[] = [];
  @Input() isLoading = false;
  @Input() isGroupNameVisible = false;
  @Input() isCommentVisible = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private profileService: ProfileService,
    private postService: PostService
  ) {
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  onPostDelete(postId: number) {
    this.posts = this.posts?.filter(post => post.id != postId);
  }

  ngOnInit(): void {
    this.profileService.newPostCreated$.subscribe(post => {
      if (post.pageId == this.pageId) {
        this.posts?.unshift(post);
      }
    })

    this.postService.postDeleted$.subscribe(postId => {
      this.posts = this.posts.filter(post => post.id != postId);
    })
  }
}
