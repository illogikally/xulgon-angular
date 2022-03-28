import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../core/authentication/authentication.service';
import {UserService} from '../shared/services/user.service';
import {Post} from '../post/post';
import {TitleService} from '../shared/services/title.service';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss']
})
export class NewsFeedComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoadingPosts = false;
  isAllPostsLoaded = false;
  pageId = this.authService.getProfileId();

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private titleService: TitleService,
  ) {
  }

  ngOnDestroy() {
  }

  ngOnInit(): void {
    this.loadInitPosts();
    this.setTitle();
  }

  setTitle() {
    this.titleService.setTitle('Xulgon');
  }

  onAttach(): void {
    this.setTitle();
  }

  onDetach(): void {
  }

  async loadInitPosts() {
    for (let i = 0; i < 2; ++ i) {
      await this.getPosts();
    }
  }

  async getPosts() {
    if (
      this.isAllPostsLoaded
      || this.isLoadingPosts
    ) return;

    this.isLoadingPosts = true;
    const offset = this.posts.length;
    const size = offset >= 4 ? 5 : 2;

    const posts = await this.userService.getNewsFeed(size, offset).toPromise();
    if (posts.length == 0) {
      this.isAllPostsLoaded = true;
    }

    this.posts = this.posts.concat(posts);
    this.isLoadingPosts = false;
  }
}
