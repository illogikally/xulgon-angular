import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent, merge, of, Subject } from 'rxjs';
import { mergeAll, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() toggleButtonTop = '10px';
  @Input() attach$ = new Subject<any>();
  @Input() detach$ = new Subject<any>();
  constructor(
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef
  ) { }

  @ViewChild('sidebar', { static: true }) sidebar!: ElementRef;
  @ViewChild('sidebarInner', { static: true }) sidebarInner!: ElementRef;
  @ViewChild('toggleButton', { static: true }) toggleButton!: ElementRef;

  ngOnInit(): void {
    this.configureOnWindowResize();
  }

  toggleSidebar() {
    const sidebar = this.sidebar.nativeElement;
    const sidebarInner = this.sidebarInner.nativeElement;
    const toggleButton = this.toggleButton.nativeElement;
    const elems = [sidebar, sidebarInner, toggleButton];
    if (sidebarInner.classList.contains('hide')) {
      elems.forEach(elem => this.renderer.removeClass(elem, 'hide'));
    }
    else {
      elems.forEach(elem => this.renderer.addClass(elem, 'hide'));
    }
  }

  configureOnWindowResize() {
    const onWindowResize$ = fromEvent(window, 'resize').pipe(takeUntil(this.detach$));
    let prevWindowWidth = 0;
    const breakPoint = 750;
    const transitionTime = 400;
    merge(this.attach$, of(null)).pipe(
      switchMap(() => onWindowResize$)
    ).subscribe(() => {
      const isHide = this.sidebarInner.nativeElement.classList.contains('hide');
      if (
        window.innerWidth < breakPoint &&
        prevWindowWidth >= breakPoint
      ) {
        !isHide && this.toggleSidebar();
        setTimeout(() => {
          this.renderer.setStyle(this.sidebar.nativeElement, 'position', 'absolute');
        }, transitionTime);
      }
      else if (
        window.innerWidth > breakPoint &&
        prevWindowWidth <= breakPoint
      ) {
        this.renderer.removeStyle(this.sidebar.nativeElement, 'position');
        isHide && this.toggleSidebar();
      }
      prevWindowWidth = window.innerWidth;
    });
  }

  get toggleButtonPosition() {
    return {
      'top': this.toggleButtonTop
    }
  }
}
