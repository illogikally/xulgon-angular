import { AfterViewInit, Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, merge, of } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { Post } from '../../post/post';
import { ProfileService } from '../../profile/profile.service';
import { GroupResponse } from '../group-response';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-timeline',
  templateUrl: './group-timeline.component.html',
  styleUrls: ['./group-timeline.component.scss']
})
export class GroupTimelineComponent implements OnInit, AfterViewInit {

  @Input() groupResponse!: GroupResponse;
  posts: Post[] = [];
  isPostView = false;
  isLoading = false;
  isAllPostsLoaded = false;
  groupId!: number;

  initPostsSize = 3;

  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('wrapper') wrapper!: ElementRef;
  @ViewChild('timeline') timeline!: ElementRef;
  @ViewChild('postsContainer') postsContainer!: ElementRef;

  onAttach$ = this.profileService.onAttach$.pipe(
    filter(id => id == this.groupId)
  );

  onDetach$ = this.profileService.onDetach$.pipe(
    filter(id => id == this.groupId)
  );

  constructor(
    private groupService: GroupService,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.getGroupIdFromRoute();
    this.getPosts();
    this.configureLoadPostOnScroll();
    this.getPostResponseFromParent();
  }

  ngAfterViewInit(): void {
    this.configureOnResize();
  }

  getPosts() {
    const size = this.posts.length ? 5 : this.initPostsSize;
    const offset = this.posts.length;

    if (!this.isPostView) {
      this.isLoading = true;
      this.groupService.getTimeline(this.groupId, size, offset)
        .subscribe(response => {
          this.posts = this.posts.concat(response.data);
          this.isLoading = false;
          if (!response.hasNext) {
            this.isAllPostsLoaded = true;
          }
        });
    }
  }

  configureLoadPostOnScroll() {
    merge(
      this.onAttach$,
      of(null)
    ).pipe(
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

  getGroupIdFromRoute() {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'))
    this.isPostView = this.route.snapshot.data['isPostView'];
    if (this.isPostView) {
      this.groupId = Number(this.route.snapshot.parent?.parent?.paramMap.get('id'));
    }
  }

  getPostResponseFromParent() {
    this.groupService.currentGroup().pipe(
      take(1)
    ).subscribe(response => {
      this.groupResponse = response;
    });
  }

  configureOnResize() {
    const wrapper = this.wrapper.nativeElement;
    const timeline = this.timeline.nativeElement;
    const defaultWidth = 892;
    
    let isStyleSet = false;
    new ResizeObserver(entries => {
      if (!entries[0].contentRect.width) return;
      this.ngZone.run(() => {
        if (wrapper.offsetWidth < defaultWidth && !isStyleSet) {
          this.renderer.setStyle(this.sidebar.nativeElement, 'visibility', 'hidden');
          this.renderer.setStyle(timeline, 'max-width', '515px');
          this.renderer.setStyle(timeline, 'display', 'block');
          isStyleSet = true;
        }
        else if (wrapper.offsetWidth >= defaultWidth) {
          this.renderer.setStyle(this.sidebar.nativeElement, 'visibility', 'visible');
          this.renderer.setStyle(timeline, 'display', 'grid');
          this.renderer.removeStyle(timeline, 'max-width');
          isStyleSet = false;
        }
      });
    }).observe(wrapper);
  }
}
