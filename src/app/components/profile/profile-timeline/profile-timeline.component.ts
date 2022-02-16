import {Location} from '@angular/common';
import {AfterViewInit, Component, ElementRef, Host, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {from, fromEvent, Observable, ReplaySubject, Subject} from 'rxjs';
import { filter, last, skip, switchMap, takeUntil, tap } from 'rxjs/operators';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MessageService} from '../../share/message.service';
import {Post} from '../../post/post';
import {PostService} from '../../post/post.service';
import {ProfileService} from '../profile.service';
import {UserProfile} from '../user-profile';

@Component({
  selector: 'app-profile-timeline',
  templateUrl: './profile-timeline.component.html',
  styleUrls: ['./profile-timeline.component.scss']
})
export class ProfileTimelineComponent implements OnInit, OnDestroy {

  @Input() userProfile!: UserProfile;

  @ViewChild('sidebar', {static: true}) sidebar!: ElementRef;
  @ViewChild('sidebar__inner', {static: true}) sidebarInner!: ElementRef;

  principleId: number;
  pageId     : number;

  timeline: Post[] = [];
  isLoadingPosts = false;
  initialHide    = true;
  isLoadedAll    = false;

  private destroyed$ = new ReplaySubject<boolean>(1);

  private detached$ = this.messageService.profileComponentDetached$.pipe(
    filter(id => id == this.pageId)
  );

  private attached$ = this.messageService.profileComponentAttached$.pipe(
    filter(id => id == this.pageId)
  );

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
    this.principleId = this.auth$.getAuthentication()!.userId as number;
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
    this.configureLoadOnScroll();
    this.messageService.profileComponentAttached$.next(this.pageId);

    this.initialHide = false;

    if (!isNaN(this.pageId)) {
      this.getPosts();
      this.profile$.getUserProfile(this.pageId)
        .subscribe(profile => {
          this.userProfile = profile;
        })
    }
  }


  configureStickySidebar() {
    const actionMenu = document.querySelector<HTMLElement>('.actions-menu-container')!;
    const MARGIN = 17;
    const NAVBAR_HEIGHT = 56;
    const FIXED_TOP = NAVBAR_HEIGHT + actionMenu.offsetHeight

    const detached$ = this.messageService.profileComponentDetached$.pipe(
      filter(id => id == this.pageId)
    );

    detached$.subscribe(() => {
      this.sidebarCss('position', 'relative');
      this.sidebarCss('top'     , '');
      this.sidebarCss('left'    , '');
    });

    const SIDEBAR = this.sidebarInner.nativeElement;
    const PARENT = this.sidebar.nativeElement;

    let oldY = window.scrollY;
    this.messageService.profileComponentAttached$.pipe(
      filter(id => id == this.pageId),
      switchMap(() => fromEvent(window, 'scroll').pipe(takeUntil(detached$)))
    ).subscribe(() => {

      const SIDEBAR_RECT = SIDEBAR.getBoundingClientRect();
      const PARENT_RECT = PARENT.getBoundingClientRect();

      const SPEED = (window.scrollY - oldY)
      if (SPEED < 0) { // Scroll up
        const mainContentY = window.scrollY + PARENT_RECT.top;

        if (
          SIDEBAR.style.position === 'fixed'
          && SIDEBAR_RECT.top <= PARENT_RECT.top
        ) {
          this.sidebarCss('top'     , '');
          this.sidebarCss('left'    , '');
          this.sidebarCss('position', 'relative');
        }

        else if (
          SIDEBAR.style.position === 'fixed'
          && SIDEBAR_RECT.top    < FIXED_TOP + MARGIN
        ) {
          const top = SIDEBAR_RECT.top - PARENT_RECT.top;
          this.sidebarCss('top'     , top + 'px');
          this.sidebarCss('left'    , 0 + 'px');
          this.sidebarCss('position', 'relative');
        }

        else if (
          SIDEBAR.style.position !== 'fixed'
          && SIDEBAR_RECT.top - SPEED  > FIXED_TOP + MARGIN
          && SIDEBAR_RECT.top > PARENT_RECT.top
        ) {
          this.sidebarCss('position', 'fixed');
          this.sidebarCss('top'     , FIXED_TOP + MARGIN + 'px');
          this.sidebarCss('left'    , PARENT_RECT.left + 'px');
        }
      } else { // Scroll down
        if (
          SIDEBAR.style.position === 'fixed'
          && SIDEBAR_RECT.bottom > window.innerHeight
        ) {

          const top = SIDEBAR_RECT.top - PARENT_RECT.top;
          this.sidebarCss('position', 'relative');
          this.sidebarCss('top'     , top + 'px');
          this.sidebarCss('left'    , '');
        }

        else if (
          SIDEBAR.style.position  !== 'fixed'
          && SIDEBAR_RECT.bottom - SPEED  < window.innerHeight - MARGIN
          && SIDEBAR.offsetHeight > window.innerHeight - FIXED_TOP - MARGIN*2
          && SIDEBAR.offsetHeight < PARENT.offsetHeight
        ) {
          const top =  window.innerHeight - SIDEBAR.offsetHeight - MARGIN;
          this.sidebarCss('width'   , SIDEBAR.offsetWidth + 'px');
          this.sidebarCss('top'     , top + 'px');
          this.sidebarCss('left'    , PARENT_RECT.left + 'px');
          this.sidebarCss('position', 'fixed');
        }

        else if (
          SIDEBAR.style.position  !== 'fixed'
          && SIDEBAR.offsetHeight <= window.innerHeight - FIXED_TOP - MARGIN*2
          && SIDEBAR_RECT.top     <= FIXED_TOP + MARGIN
        ) {
          this.sidebarCss('width'   , SIDEBAR.offsetWidth + 'px');
          this.sidebarCss('top'     , FIXED_TOP + MARGIN + 'px');
          this.sidebarCss('left'    , PARENT_RECT.left + 'px');
          this.sidebarCss('position', 'fixed');
        }
      }
      oldY = window.scrollY;
    });
  }

  sidebarCss(style: string, value: string) {
    this.renderer.setStyle(this.sidebarInner.nativeElement, style, value);
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
    this.attached$.pipe(
      switchMap(() => fromEvent(window, 'scroll').pipe(takeUntil(this.detached$)))
    ).subscribe(() => {
      if (
        window.scrollY >= document.body.scrollHeight - 1.2*window.innerHeight
        && !this.isLoadingPosts
        && !this.isLoadedAll
      ) {
        this.getPosts();
      }
    })

  }

  updateSticky = new Subject<boolean>();

  updateMethod() {
    this.updateSticky.next(true);
  }

}
