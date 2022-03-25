import {Directive, ElementRef, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import { LabelService } from './label.service';

@Directive({
  selector: '[Label]'
})
export class LabelDirective implements OnInit, OnDestroy  {

  @Input() disabled = false;
  @Input() labelText = '';
  @Input() delay = 0;
  constructor(
    private self: ElementRef,
    private labelService: LabelService
  ) { }

  ngOnInit(): void {
  }

  @HostListener('mouseenter')
  show() {
    if (!this.disabled) {
      this.labelService.show$.next({
        target: this.self.nativeElement, 
        text: this.labelText,
        delay: this.delay
      });
    }
  }

  @HostListener('mouseleave')
  hide() {
    this.labelService.hide$.next();
  }

  ngOnDestroy() {
    this.labelService.hide$.next();
  }
}
