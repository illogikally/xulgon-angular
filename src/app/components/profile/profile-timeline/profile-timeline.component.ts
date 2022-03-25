import {AfterViewInit, Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RxStompService} from '@stomp/ng2-stompjs';
import {fromEvent, Subject} from 'rxjs';
import {filter, switchMap, takeUntil} from 'rxjs/operators';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Post} from '../../post/post';
import {PostService} from '../../post/post.service';
import {PhotoService} from '../../share/photo/photo.service';
import {ProfileService} from '../profile.service';
import {UserPage} from '../user-profile';

@Component({
  selector: 'app-profile-timeline',
  templateUrl: './profile-timeline.component.html',
  styleUrls: ['./profile-timeline.component.scss']
})
export class ProfileTimelineComponent implements OnInit, AfterViewInit {

  @Input() userPage!: UserPage;

  @ViewChild('postsContainer') postsContainer!: ElementRef;
  @ViewChild('self') self!: ElementRef;

  principleId = this.authenticationService.getAuthentication()!.userId;
  pageId: number;

  timeline: Post[] = [];
  isLoadingPosts = false;
  isInitLoaded = false;
  isLoadedAll = false;
  pagePhotoSetId!: number;

  isComponentAttached = true;
  isComponentDetached = false;
  lastPostId = 0;
  toggleStickySidebar = new Subject<any>();


  onDetach$ = this.profileService.onDetach$.pipe(
    filter(id => id == this.pageId)
  );

  onAttach$ = this.profileService.onAttach$.pipe(
    filter(id => id == this.pageId)
  );

  constructor(
    private profileService: ProfileService,
    public route: ActivatedRoute,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private rxStompService: RxStompService,
    private postService: PostService,
    private authenticationService: AuthenticationService,
    private photoService: PhotoService
  ) {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    this.pageId = Number(id);
  }

  onDetach() {
    this.profileService.onDetach$.next(this.pageId);
  }

  onAttach() {
    this.profileService.onAttach$.next(this.pageId);
  }

  ngOnInit(): void {
    this.getPosts();
    this.getPhotosAndStuffs();
    this.listenToWebSocketNewPost();
  }

  getPhotosAndStuffs() {
    if (!isNaN(this.pageId)) {
      this.profileService.getUserProfile(this.pageId) .subscribe(profile => {
          this.userPage = profile;
      })
      this.photoService.getPagePhotoSetId(this.pageId).subscribe(id => {
        this.pagePhotoSetId = id;
      });
    }
  }

  ngAfterViewInit(): void {
    this.configureLoadPostOnScroll();
    this.configureOnResize();
    this.profileService.onAttach$.next(this.pageId);
  }

  getPosts(): void {
    this.isLoadingPosts = true;
    const size = this.timeline.length ? 5 : 2;
    const before = this.lastPostId || Number.MAX_SAFE_INTEGER;

    if (this.pageId !== NaN) {
      this.postService.getPostsByProfile(this.pageId, size, before)
        .subscribe(response => {
          this.timeline = this.timeline.concat(response.data);
          this.isLoadingPosts = false;
          this.isInitLoaded = true;
          const [lastPost] = this.timeline.slice(-1);
          this.lastPostId = lastPost?.id;
          if (!response.hasNext) {
            this.isLoadedAll = true;
          }
        });
    }
  }

  configureLoadPostOnScroll() {
    this.onAttach$.pipe(
      switchMap(() => fromEvent(window, 'scroll')
        .pipe(takeUntil(this.onDetach$))
      )
    ).subscribe(() => {
      const postContainerRect =
        this.postsContainer.nativeElement.getBoundingClientRect();
      if (
        window.scrollY >= postContainerRect.bottom - 1.2 * window.innerHeight
        && !this.isLoadingPosts
        && !this.isLoadedAll
      ) {
        this.getPosts();
      }
    })
  }

  configureOnResize() {
    const self = this.self.nativeElement;
    const parent = self.parentElement;
    const defaultWidth = 892;
    let isStyleSet = false;
    new ResizeObserver(entries => {
      if (!entries[0].contentRect.width) return;
      this.ngZone.run(() => {
        if (parent.offsetWidth < defaultWidth && !isStyleSet) {
          this.renderer.addClass(self, 'collapse');
          isStyleSet = true;
          this.toggleStickySidebar.next(true);
        }
        else if (parent.offsetWidth >= defaultWidth) {
          this.renderer.removeClass(self, 'collapse');
          this.toggleStickySidebar.next(false);
          isStyleSet = false;
        }
      });
    }).observe(parent);
  }

  listenToWebSocketNewPost() {
    this.rxStompService.watch('/topic/post').subscribe(message => {
      const dto = JSON.parse(message.body);
      if (dto.type == 'POST' && dto.parentId == this.pageId) {
        this.timeline.unshift(dto.content);
      }
    });
  }

}
