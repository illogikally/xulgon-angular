import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {ProfileService} from '../../profile/profile.service';
import {Post} from '../post';
import {PostService} from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, AfterViewInit {

  @Input() pageId?: number;
  @Input() posts: Post[] = [];
  @Input() isLoading = false;
  @Input() isGroupNameVisible = false;
  @Input() isCommentVisible = false;
  @Output() postsChange = new EventEmitter<Post[]>();
  @Output() lastPostIsInView = new EventEmitter<any>();

  @ViewChildren('post') postElements!: QueryList<ElementRef>;
  @ViewChild('self') self!: ElementRef;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private profileService: ProfileService,
    private postService: PostService
  ) {
  }

  ngAfterViewInit(): void {
    console.log(this.postElements);
    this.watchLastPostInView();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  onPostDelete(postId: number) {
    this.posts = this.posts?.filter(post => post.id != postId);
    this.postsChange.emit(this.posts);
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

  watchLastPostInView() {
    const intersectionObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        intersectionObserver.unobserve(entries[0].target);
        this.lastPostIsInView.emit();
      }
    });

    new MutationObserver(entries => {
      const lastPost = entries.slice(-1)[0].addedNodes[0] as Element;
      intersectionObserver.observe(lastPost);
    }).observe(this.self.nativeElement, {childList: true})
  }
}
