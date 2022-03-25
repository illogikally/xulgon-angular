import {Location} from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fromEvent, merge, of, Subject} from 'rxjs';
import {filter, switchMap, takeUntil, throttleTime} from 'rxjs/operators';
import {Post} from '../../post/post';
import {SearchService} from '../search.service';

@Component({
  selector: 'app-by-posts',
  templateUrl: './by-posts.component.html',
  styleUrls: ['./by-posts.component.scss']
})
export class ByPostsComponent implements OnInit {

  posts: Post[] = [];
  isLoadingPosts = false;
  isLoadedPosts = false;
  hasNextPost = true;
  currentQuery = '';
  constructor(
    private location: Location,
    private searchService: SearchService
  ) {
  }

  attached$ = new Subject<any>();
  detached$ = new Subject<any>();

  @ViewChild('postContainer', {static: true}) postContainer!: ElementRef;
  onDetach() {
    this.detached$.next();
  }

  onAttach() {
    this.attached$.next();
  }

  ngOnInit(): void {
    this.listenOnQuery();
    this.configureLoadPostOnSroll();
  }

  listenOnQuery() {
    merge(
      // For some reason onAttached() gets called twice.
      this.attached$.pipe(throttleTime(1e3)),
      of(null)
    ).pipe(
      switchMap(() => this.searchService.search$)
    ).pipe(
      takeUntil(this.detached$),
      filter(query => query != this.currentQuery)
    ).subscribe(query => {
      if (!query) return;
      this.currentQuery = query;
      this.posts = [];
      this.getPosts();
    });
  }

  getPosts() {
    this.isLoadingPosts = true;
    const size = 3;
    const offset = this.posts.length;
    this.searchService.byPost(this.currentQuery, size, offset).subscribe(response => {
      this.posts = this.posts.concat(response.data);
      this.isLoadedPosts = true;
      this.isLoadingPosts = false;
      this.hasNextPost = response.hasNext;
    });
  }

  configureLoadPostOnSroll() {
    merge(
      this.attached$,
      of(null)
    ).pipe(
      switchMap(() => fromEvent(window, 'scroll')
        .pipe(takeUntil(this.detached$))
      )
    ).subscribe(() => {
      const postContainerRect =
        this.postContainer.nativeElement.getBoundingClientRect();
      if (
        window.scrollY >= postContainerRect.bottom - 1.2 * window.innerHeight
        && !this.isLoadingPosts
        && this.hasNextPost
      ) {
        this.getPosts();
      }
    })
  }
}
