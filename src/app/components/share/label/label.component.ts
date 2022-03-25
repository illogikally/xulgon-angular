import {ChangeDetectorRef, Component, ElementRef, HostListener, Input, NgZone, OnInit, Renderer2, ViewChild} from '@angular/core';
import { fromEvent, interval, merge, timer } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';
import { LabelService } from './label.service';

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

  ngOnInit(): void {
    this.labelService.show$.subscribe(data => {
      const {target, text, delay} = data;
      this.text = text;
      this.changeDetector.detectChanges();
      timer(delay).pipe(takeUntil(this.labelService.hide$), takeUntil(fromEvent(window, 'click')), take(1))
        .subscribe(() => {
          this.move(target);
          this.show();
          this.isHidden = false;
        })
    });
    merge(
      fromEvent(window, 'click'),
      this.labelService.hide$
    ).pipe(filter(() => !this.isHidden)).subscribe(() => {
      this.hide(); 
      this.isHidden = true;
    });
  }

  move(target: HTMLElement) {
    const MARGIN = 2;
    const targetRect = target.getBoundingClientRect();
    const self = this.self.nativeElement;

    let left = targetRect.left + target.offsetWidth/2 - self.offsetWidth/2;
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
