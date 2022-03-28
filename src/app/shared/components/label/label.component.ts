import {ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {fromEvent, merge, timer} from 'rxjs';
import {filter, take, takeUntil} from 'rxjs/operators';
import {LabelService} from './label.service';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {

  constructor(
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,
    private labelService: LabelService
  ) { }

  @ViewChild('self') self!: ElementRef;
  text = '';
  isHidden = true;
  triangleTranslateX = 0;

  ngOnInit(): void {
    this.listenOnOpenCalled()
    this.configureCloseOnClick();
  }

  listenOnOpenCalled() {
    this.labelService.show$.subscribe(data => {
      const {target, text, delay} = data;
      this.text = text;
      this.changeDetector.detectChanges();
      timer(delay).pipe(
        takeUntil(this.labelService.hide$),
        takeUntil(fromEvent(window, 'click')),
        take(1)
      ).subscribe(() => {
          this.move(target);
          this.show();
          this.isHidden = false;
        })
    });
  }

  configureCloseOnClick() {
    merge(
      fromEvent(window, 'click'),
      this.labelService.hide$
    ).pipe(filter(() => !this.isHidden)).subscribe(() => {
      this.hide();
      this.isHidden = true;
    });
  }
  move(target: HTMLElement) {
    const MARGIN          = 2;
    const HOR_MARGIN      = 5;
    const targetRect      = target.getBoundingClientRect();
    const self            = this.self.nativeElement;
    const SCROLLBAR_WIDTH = window.innerWidth - document.documentElement.clientWidth;
    let left              = targetRect.left + target.offsetWidth/2 - self.offsetWidth/2;
    this.triangleTranslateX = 0;

    const windowRightOffset
      = left + self.offsetWidth - (window.innerWidth - HOR_MARGIN - SCROLLBAR_WIDTH);
    if (windowRightOffset >= 0) {
      left -= windowRightOffset
      this.triangleTranslateX += windowRightOffset;
    }

    left = left < 10 ? 10 : left;
    let top = targetRect.bottom + MARGIN + 8;
    top += window.scrollY;

    this.setSelfStyle('left', left + 'px')
    this.setSelfStyle('top', top + 'px');
  }

  show() {
    this.setSelfStyle('visibility', 'visible');
    this.renderer.addClass(this.self.nativeElement, 'pop');
  }

  hide() {
    this.setSelfStyle('visibility', 'hidden');
    this.renderer.removeClass(this.self.nativeElement, 'pop');
  }

  private setSelfStyle(style: string, value: string) {
    this.renderer.setStyle(this.self.nativeElement, style, value);
  }
}
