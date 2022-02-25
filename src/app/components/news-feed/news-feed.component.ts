import {HttpClient} from '@angular/common/http';
import { getSafePropertyAccessString } from '@angular/compiler';
import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import { Router } from '@angular/router';
import {AuthenticationService} from '../authentication/authentication.service';
import {UserService} from '../share/user.service';
import {Post} from '../post/post';
import { TitleService } from '../share/title.service';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss']
})
export class NewsFeedComponent implements OnInit, OnDestroy {

  pageId: number;
  posts: Post[] = [];
  isLoadingPosts = false;
  isAllPostsLoaded = false;
  isAttached = true;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private title: Title,
    private titleService: TitleService,
    private router: Router,
    private http: HttpClient) {
      this.pageId = authService.getProfileId();
  }

  ngOnDestroy() {
  }

  ngOnInit(): void {
    this.getPosts();
    this.setTitle();
  }

  setTitle() {
    this.titleService.setTitle('Xulgon');
  }

  @HostListener('window:scroll', [])
  loadOnScroll(): void {
    if (
      window.scrollY >= document.body.scrollHeight - 1.2*window.innerHeight
      && !this.isLoadingPosts
      && !this.isAllPostsLoaded
      && this.isAttached
      ) {
        this.getPosts();

    }
  }

  onAttach(): void {
    this.setTitle();
    this.isAttached = true;
  }

  onDetach(): void {
    this.isAttached = false;
  }

  getPosts(): void {
    this.isLoadingPosts = true;
    const size = 5;
    const offset = this.posts.length;

    this.userService.getNewsFeed(size, offset)
      .subscribe(posts => {
        if (posts.length == 0) {
          this.isAllPostsLoaded = true;
        }

        this.posts = this.posts.concat(posts);
        this.isLoadingPosts = false;
      }, error => {
      });
  }
}
