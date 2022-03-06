import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[LoadOnScroll]'
})
export class LoadOnScrollDirective implements OnInit {

  @Output() load = new EventEmitter();
  constructor(
    private self: ElementRef
  ) { }

  ngOnInit(): void {
    this.configureLoadPostOnScroll()
  }

  configureLoadPostOnScroll() {
    fromEvent(window, 'scroll').subscribe(() => {
      const self = this.self.nativeElement.getBoundingClientRect();
      if (window.scrollY >= self.bottom - 1.2*window.innerHeight) {
        this.load.emit();
      }
    })
  }

}
