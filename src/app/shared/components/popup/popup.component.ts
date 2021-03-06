import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {fromEvent, ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() parent!: HTMLElement;
  @Input() alignment = 'CENTER';
  @Input() triangle = true;
  @Input() margin = 5;
  @Input() padding = '5px';
  @Input() position: 'ABOVE' | 'BELOW' = 'BELOW';
  @Output() close = new EventEmitter();

  @ViewChild('self', { static: true }) self!: ElementRef;
  @ViewChild('triangleElement', { static: true }) triangleElement!: ElementRef;

  onDestroy$ = new ReplaySubject<any>(1);


  INITIAL_X = 0;
  HOR_MARGIN = 5;
  SCROLLBAR_WIDTH = 0;
  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  ngOnInit(): void {
    this.configureOnWindowResize();
  }

  ngAfterViewInit(): void {
    this.init();
  }

  configureOnWindowResize() {
    const self = this.self.nativeElement;
    fromEvent(window, 'resize').pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(() => {
      const selfRect = self.getBoundingClientRect();
      const parentRect = this.parent.getBoundingClientRect();

      const currentTranslateX = selfRect.left - parentRect.left;
      const offset = selfRect.right - window.innerWidth + this.SCROLLBAR_WIDTH + this.HOR_MARGIN;

      if (offset > 0 || currentTranslateX < this.INITIAL_X) {
        let translateX = currentTranslateX - offset;
        translateX = translateX > this.INITIAL_X ? this.INITIAL_X : translateX;
        this.setSelfStyle('transform', `translateX(${translateX}px)`)
      }
    });
  }

  init() {
    const VER_MARGIN = this.margin;
    const TRIANGLE_HEIGHT = this.triangle ? 8 : 0;
    const self = this.self.nativeElement;
    const selfRect = self.getBoundingClientRect();
    let left = this.calculateLeftPositionToParent();

    const isOverflowLeft = selfRect.left + left < 0;
    if (isOverflowLeft) {
      left -= selfRect.left + left;
    }

    this.SCROLLBAR_WIDTH = window.innerWidth - document.documentElement.clientWidth;
    const offset = selfRect.right + left - window.innerWidth + this.SCROLLBAR_WIDTH + this.HOR_MARGIN;
    if (offset > 0) {
      left -= offset;
    }

    let top = this.parent.offsetHeight + VER_MARGIN + TRIANGLE_HEIGHT;
    this.setSelfStyle('transform', `translateX(${left}px)`);
    const position = this.position == 'BELOW' ? 'top' : 'bottom';
    this.setSelfStyle(position, top + 'px');

    this.renderer.setStyle(
      this.triangleElement.nativeElement,
      'transform',
      `translate(-50%, ${VER_MARGIN}px)`
    );
  }

  calculateLeftPositionToParent(): number {
    let left = this.parent.offsetWidth / 2;
    switch (this.alignment) {
      case 'LEFT':
        left = 0;
        break;
      case 'CENTER':
        left = this.parent.offsetWidth / 2 - this.self.nativeElement.offsetWidth / 2;
        break;
      case 'RIGHT':
        left = this.parent.offsetWidth;
        break;
    }
    this.INITIAL_X = left;
    return this.INITIAL_X;
  }

  private setSelfStyle(style: string, value: string) {
    this.renderer.setStyle(this.self.nativeElement, style, value);
  }
}
