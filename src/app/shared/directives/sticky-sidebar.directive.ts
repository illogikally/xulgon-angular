import {Directive, Input, OnInit, Renderer2} from '@angular/core';
import {fromEvent, merge, Observable, of, Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';

@Directive({
  selector: '[StickySidebar]'
})
export class StickySidebarDirective implements OnInit {

  @Input() sidebarInner!: HTMLElement;
  @Input() parent!: HTMLElement;
  @Input() onAttach$ = new Observable<any>();
  @Input() onDetach$ = new Observable<any>();
  @Input() disabled = false;
  @Input() toggle = new Subject<boolean>();

  constructor(
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.configureOnWindowResize();
    this.configureStickySidebar();
    this.listenOnDisableSidebar();
  }

  listenOnDisableSidebar() {
    this.toggle!.subscribe(disable => {
      this.disabled = disable;
      if (disable) {
        this.sidebarCss('width', 'auto');
        this.sidebarCss('position', 'static');
      }
      else {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('scroll'));
        }, 100);
      }
    });
  }

  configureStickySidebar() {
    const actionMenu = document.querySelector<HTMLElement>('.actions-menu-container')!;
    const MARGIN = 17;
    const NAVBAR_HEIGHT = 56;
    const FIXED_TOP = NAVBAR_HEIGHT + actionMenu.offsetHeight

    this.onDetach$.subscribe(() => {
      this.sidebarCss('position', 'relative');
      this.sidebarCss('top'     , '');
      this.sidebarCss('left'    , '');
    });

    const SIDEBAR = this.sidebarInner;
    const PARENT = this.parent;

    let oldY = window.scrollY;
    const onScroll$ = fromEvent(window, 'scroll').pipe(takeUntil(this.onDetach$));
    merge( this.onAttach$, of(null)).pipe(
      switchMap(() => onScroll$)
    ).subscribe(() => {
      const SIDEBAR_RECT = SIDEBAR.getBoundingClientRect();
      const PARENT_RECT = PARENT.getBoundingClientRect();
      const SIDEBAR_WIDTH = PARENT.offsetWidth;

      if (this.disabled || SIDEBAR_WIDTH == 0) return;
      const SPEED = (window.scrollY - oldY)
      
      if (SPEED < 0) { // Scroll up

        if (
          SIDEBAR.style.position === 'fixed'
          && SIDEBAR_RECT.top <= PARENT_RECT.top
        ) {
          this.sidebarCss('top'     , '');
          this.sidebarCss('left'    , '0px');
          this.sidebarCss('position', 'static');
          this.sidebarCss('width', 'auto');
        }

        else if (
          SIDEBAR.style.position === 'fixed'
          && SIDEBAR_RECT.top    < FIXED_TOP + MARGIN
        ) {
          const top = SIDEBAR_RECT.top - PARENT_RECT.top;
          this.sidebarCss('top'     , top + 'px');
          this.sidebarCss('left'    , '0px');
          this.sidebarCss('position', 'relative');
        }

        else if (
          SIDEBAR.style.position !== 'fixed'
          && SIDEBAR_RECT.top - SPEED  > FIXED_TOP + MARGIN
          // Modal disables body scroll
          && document.body.style.position != 'fixed'
          && SIDEBAR_RECT.top > PARENT_RECT.top
        ) {
          this.sidebarCss('position', 'fixed');
          this.sidebarCss('top'     , FIXED_TOP + MARGIN + 'px');
          this.sidebarCss('left'    , PARENT_RECT.left + 'px');
        }
      } else if (window.scrollY > PARENT_RECT.top) { // Prevent on page load
        // Scroll down

        if (
          SIDEBAR.style.position === 'fixed'
          && SIDEBAR_RECT.bottom > window.innerHeight
        ) {

          const top = SIDEBAR_RECT.top - PARENT_RECT.top;
          this.sidebarCss('position', 'relative');
          this.sidebarCss('top'     , top + 'px');
          this.sidebarCss('left'    , '');
          this.sidebarCss('width', SIDEBAR_WIDTH + 'px');
        }

        // Stick to bottom
        else if (
          SIDEBAR.style.position  !== 'fixed'
          && SIDEBAR_RECT.bottom - SPEED  < window.innerHeight - MARGIN
          && SIDEBAR.offsetHeight > window.innerHeight - FIXED_TOP - MARGIN*2
          && SIDEBAR.offsetHeight < PARENT.offsetHeight
        ) {
          const top =  window.innerHeight - SIDEBAR.offsetHeight - MARGIN;
          this.sidebarCss('width'   , SIDEBAR_WIDTH + 'px');
          this.sidebarCss('top'     , top + 'px');
          this.sidebarCss('left'    , PARENT_RECT.left + 'px');
          this.sidebarCss('position', 'fixed');

        }

        else if (
          SIDEBAR.style.position  !== 'fixed'
          && SIDEBAR.offsetHeight <= window.innerHeight - FIXED_TOP - MARGIN*2
          && SIDEBAR_RECT.top     <= FIXED_TOP + MARGIN
        ) {
          this.sidebarCss('width'   , SIDEBAR_WIDTH + 'px');
          this.sidebarCss('top'     , FIXED_TOP + MARGIN + 'px');
          this.sidebarCss('left'    , PARENT_RECT.left + 'px');
          this.sidebarCss('position', 'fixed');
        }
      }

      oldY = window.scrollY;
    });
  }

  sidebarCss(style: string, value: string) {
    this.renderer.setStyle(this.sidebarInner, style, value);
  }

  configureOnWindowResize() {
    const onWindowResize$ = fromEvent(window, 'resize').pipe(takeUntil(this.onDetach$));
    merge(this.onAttach$, of(null)).pipe(
      switchMap(() => onWindowResize$)
    ).subscribe(() => {
      if (!this.disabled) {
        const parentLeft = this.parent.getBoundingClientRect().left;
        const sidebarPosition = this.sidebarInner.style.position;
        if (sidebarPosition == 'fixed') {
          this.sidebarCss('left', parentLeft + 'px');
        }
      }
    });
  }

}
