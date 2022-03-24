import {Directive, ElementRef, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {NotImplementedService} from './not-implemented.service';

@Directive({
  selector: '[NotImplemented]'
})
export class NotImplementedDirective implements OnInit, OnDestroy  {

  @Input() disabled = false;
  constructor(
    private self: ElementRef,
    private nIService: NotImplementedService
  ) { }

  ngOnInit(): void {
  }

  @HostListener('mouseenter')
  show() {
    if (!this.disabled) {
      this.nIService.show$.next(this.self.nativeElement);
    }
  }

  @HostListener('mouseleave')
  hide() {
    this.nIService.hide$.next();
  }

  ngOnDestroy() {
    this.nIService.hide$.next();
  }
}
