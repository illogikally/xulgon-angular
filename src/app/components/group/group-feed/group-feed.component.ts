import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, merge, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Post } from '../../post/post';
import { UserService } from '../../share/user.service';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-feed',
  templateUrl: './group-feed.component.html',
  styleUrls: ['./group-feed.component.scss']
})
export class GroupFeedComponent implements OnInit, OnDestroy {

  posts: Post[] = [];

  isLoading = false;
  isPostsLoaded = false;
  initPostsSize = 6;
  isAllPostsLoaded = false;
  @ViewChild('postsContainer') postsContainer!: ElementRef;

  onAttach$ = new Subject<any>();
  onDetach$ = new Subject<any>();

  constructor(
    private groupService: GroupService
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.getPosts();
    this.configureLoadPostOnScroll();
  }

  onAttach() {
    this.onAttach$.next();
  }

  onDetach() {
    this.onDetach$.next();
  }

  getPosts() {
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

  configureLoadPostOnScroll() {
    merge(this.onAttach$, of(null)).pipe(
      switchMap(() => fromEvent(window, 'scroll')
        .pipe(takeUntil(this.onDetach$))
      )
    ).subscribe(() => {
      const postContainerRect = this.postsContainer.nativeElement.getBoundingClientRect();
      
      if (
        window.scrollY >= postContainerRect.bottom - 1.2 * window.innerHeight
        && !this.isLoading
        && !this.isAllPostsLoaded
      ) {
        this.getPosts();
      }
    })
  }

}
