import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() toggle!:  Observable<any>; 
  @Input() background = 'rgba(0, 0, 0, .7)';
  @Output() closed = new EventEmitter();

  @ViewChild('self') self!: ElementRef;
  @ViewChild('clickOutside') click!: ElementRef;

  isHidden = true;
  constructor(
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.toggle.subscribe(() => {
      this.isHidden ? this.show() : this.hide();
    });
  }

  show() {
    setTimeout(() => {
      this.isHidden = false;
      this.changeDetector.detectChanges();
      this.renderer.setStyle(this.self.nativeElement, 'top', '0px');
    }, 10);

    this.renderer.setStyle(document.body, 'top', -window.scrollY + 'px');
    this.renderer.setStyle(document.body, 'position', 'fixed');
  }

  hide() {
    const top = -parseInt(document.body.style.top);
    this.isHidden = true;
    this.renderer.removeStyle(document.body, 'position');
    window.scrollTo({top: top});
    this.closed.emit();
  }
}
