import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NotImplementedService} from './not-implemented.service';

@Component({
  selector: 'app-not-implemented',
  templateUrl: './not-implemented.component.html',
  styleUrls: ['./not-implemented.component.scss']
})
export class NotImplementedComponent implements OnInit {

  constructor(
    private renderer: Renderer2,
    private notImplementedService: NotImplementedService
  ) { }

  @ViewChild('self') self!: ElementRef;

  isHidden = true;
  ngOnInit(): void {
    this.notImplementedService.show$.subscribe(element => {
        this.move(element);
        this.show();
    });
    this.notImplementedService.hide$.subscribe(() => {
        this.hide();
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
  }

  hide() {
    this.setSelfStyle('visibility', 'hidden');
  }

  private setSelfStyle(style: string, value: string) {
    this.renderer.setStyle(this.self.nativeElement, style, value);
  }
}
