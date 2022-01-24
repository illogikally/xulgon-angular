import {Location} from '@angular/common';
import {AfterViewInit, Component, Host, HostListener, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {from, fromEvent, Observable, ReplaySubject, Subject} from 'rxjs';
import { filter, last, skip, switchMap, takeUntil, tap } from 'rxjs/operators';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MessageService} from '../../common/message.service';
import {Post} from '../../post/post';
import {PostService} from '../../post/post.service';
import {ProfileService} from '../profile.service';
import {UserProfile} from '../user-profile';

@Component({
  selector: 'app-profile-timeline',
  templateUrl: './profile-timeline.component.html',
  styleUrls: ['./profile-timeline.component.scss']
})
export class ProfileTimelineComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() userProfile!: UserProfile;
  @Input() onAttach$!: Observable<void>;
  @Input() onDetach$!: Observable<void>;

  principleId: number;
  pageId     : number;

  timeline: Post[] = [];
  isLoadingPosts = false;
  initialHide    = true;
  isLoadedAll    = false;

  private destroyed$ = new ReplaySubject<boolean>(1);

  sidebar!: HTMLElement;

  constructor(
    private renderer: Renderer2,
    private title   : Title,
    private messageService: MessageService,
    private location: Location,
    private router  : Router,
    private route   : ActivatedRoute,
    private post$   : PostService,
    private profile$: ProfileService,
    private auth$   : AuthenticationService
  ) {
    this.principleId = this.auth$.getUserId() as number;
    const id = this.route.parent?.snapshot.paramMap.get('id');
    this.pageId = Number(id);

  }

  ngOnDestroy() {
    // this.destroyed$.next(true);
    // this.destroyed$.complete()
  }

  onDetach() {
    this.messageService.profileComponentDetached$.next(this.pageId);
  }

  onAttach() {
    this.messageService.profileComponentAttached$.next(this.pageId);
  }

  ngOnInit(): void {

    this.configureStickySidebar();
    this.messageService.profileComponentAttached$.next(this.pageId);

    this.initialHide = false;

    if (this.pageId !== NaN) {
      this.getPosts();
      this.profile$.getUserProfile(this.pageId)
        .subscribe(profile => {
          this.userProfile = profile;
        })
    }

    // this.message$.onProfileLoaded()
    // .pipe(
    //   // takeUntil(this.destroyed$),
    //   filter(p => !!Object.keys(p).length),
    //   take(1))
    // .subscribe(profile => {
    //   console.log(profile);

    //   this.userProfile = profile;
    //   this.post$.getPostsByPageId(profile.id).subscribe(timeline => {
    //     this.timeline = timeline;
    //   });
    //   this.message$.sendLoadedProfile({} as UserProfile);
    // });
  }

  ngAfterViewInit(): void {
  }

  configureStickySidebar() {
    const actionMenu = document.querySelector<HTMLElement>('.actions-menu-container');
    if (!actionMenu) return;

    const FIXED_BOTTOM = 15;
    const NAVBAR_HEIGHT = 56;
    const FIXED_TOP = NAVBAR_HEIGHT + actionMenu.offsetHeight + FIXED_BOTTOM;


    const detached$ = this.messageService.profileComponentDetached$.pipe(
      filter(id => id == this.pageId)
    );

    detached$.subscribe(() => {
      this.sidebar = document.querySelector<HTMLElement>('.sidebar__inner')!;
      this.sidebarRemove('bottom');
      this.sidebarRemove('top');
      this.sidebarRemove('left');
      // this.sidebarCss('bottom'  , '');
      // this.sidebarCss('top'     , '');
      // this.sidebarCss('left'    , '');
      this.sidebarCss('position', 'relative');
    });

    let oldY = window.scrollY;
    this.messageService.profileComponentAttached$.pipe(
      filter(id => id == this.pageId),
      switchMap(() => fromEvent(window, 'scroll').pipe(takeUntil(detached$)))
    ).subscribe(() => {
      
      // this.sidebar         = document.querySelector<HTMLElement>('.sidebar__inner')!;
      this.sidebar = document.getElementsByClassName('sidebar__inner')[0] as HTMLElement;
      // const CONTAINER      = document.querySelector<HTMLElement>('#main-content')!;
      const CONTAINER      = document.getElementById('main-content')!;
      
      const SIDEBAR        = this.sidebar;
      const SIDEBAR_RECT   = SIDEBAR.getBoundingClientRect()!;
      const CONTAINER_RECT = CONTAINER.getBoundingClientRect()!;
      const IS_SCROLL_UP   = oldY > window.scrollY;

      const SPEED = window.scrollY - oldY
      if (IS_SCROLL_UP) {
        const mainContentY = window.scrollY + CONTAINER_RECT.top;

        if (window.scrollY + FIXED_TOP < mainContentY) {
          this.sidebarCss('bottom'  , '');
          this.sidebarCss('top'     , '0px');
          this.sidebarCss('left'    , '0px');
          this.sidebarCss('position', 'relative');
        } else {

          if (
            SIDEBAR.style.position === 'fixed'
            && SIDEBAR_RECT.top    < FIXED_TOP
          ) {
            const top = SIDEBAR_RECT.top - CONTAINER_RECT.top;
            this.sidebarCss('bottom'  , '');
            this.sidebarCss('top'     , top + 'px');
            this.sidebarCss('left'    , 0 + 'px');
            this.sidebarCss('position', 'relative');
          } 

          else if (
            SIDEBAR.style.position !== 'fixed'
            && SIDEBAR_RECT.top - SPEED  > FIXED_TOP
          ) {
            this.sidebarCss('bottom'  , '')
            this.sidebarCss('position', 'fixed');
            this.sidebarCss('top'     , FIXED_TOP + 'px');
            this.sidebarCss('left'    , CONTAINER_RECT.left + 'px');
          }
        }
      } else {
        if (
          SIDEBAR.style.position === 'fixed'
          && SIDEBAR_RECT.bottom > window.innerHeight
        ) {
          const top = SIDEBAR_RECT.top - CONTAINER_RECT.top;
          this.sidebarCss('top'     , top + 'px');
          this.sidebarCss('left'    , 0 + 'px');
          this.sidebarCss('position', 'relative');
        } 

        else if (
          SIDEBAR.style.position  !== 'fixed'
          && SIDEBAR_RECT.bottom - SPEED  < window.innerHeight - FIXED_BOTTOM
          && SIDEBAR.offsetHeight > window.innerHeight - FIXED_TOP - FIXED_BOTTOM
        ) {
          this.sidebarCss('top'     , '');
          this.sidebarCss('bottom'  , FIXED_BOTTOM + 'px');
          this.sidebarCss('width'   , SIDEBAR.offsetWidth + 'px');
          this.sidebarCss('left'    , CONTAINER_RECT.left + 'px');
          this.sidebarCss('position', 'fixed');
        } 

        else if (
          SIDEBAR.style.position  !== 'fixed'
          && SIDEBAR.offsetHeight < window.innerHeight - FIXED_TOP - FIXED_BOTTOM
          && SIDEBAR_RECT.top     < FIXED_TOP
        ) {
          this.sidebarCss('width'   , SIDEBAR.offsetWidth + 'px');
          this.sidebarCss('top'     , FIXED_TOP + 'px');
          this.sidebarCss('left'    , CONTAINER_RECT.left + 'px');
          this.sidebarCss('position', 'fixed');
        }

      }
      // console.log(SIDEBAR.style.position);
      // console.log(SIDEBAR_RECT.bottom, window.innerHeight - MARGIN);
      // console.log(SIDEBAR.offsetHeight, window.innerHeight - FIXED_TOP);

      oldY = window.scrollY;
    });
  }

  sidebarCss(style: string, value: string) {
    this.renderer.setStyle(this.sidebar, style, value);
  }

  sidebarRemove(style: string) {
    this.renderer.removeStyle(this.sidebar, style);
  }


  getPosts(): void {
    this.isLoadingPosts = true;
    const size = this.timeline.length ? 5 : 2;
    const offset = this.timeline.length;

    if (this.pageId !== NaN) {
      this.post$
        .getPostsByPageId(this.pageId, size, offset)
        .subscribe(posts => {
          this.timeline = this.timeline.concat(posts);
          this.isLoadingPosts = false;
          if (!posts.length) {
            this.isLoadedAll = true;
          }
        });
    }
  }

  configureLoadOnScroll() {

  }

  @HostListener('window:scroll', ['$event'])
  loadOnScroll(event: any): void {
    if (
      window.scrollY >= document.body.scrollHeight - 1.2*window.innerHeight
      && !this.isLoadingPosts
      && !this.isLoadedAll
      && /\/\d+/.test(this.router.url)
      ) {
        this.getPosts();
    }
  }

  updateSticky = new Subject<boolean>();

  updateMethod() {
    this.updateSticky.next(true);
  }

}
