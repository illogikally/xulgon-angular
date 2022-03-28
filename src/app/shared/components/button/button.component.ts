import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  RendererStyleFlags2,
  ViewChild
} from '@angular/core';
import * as Color from 'color';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, AfterViewInit {

  @Input() background = '#d8dadf';
  @Input() color = '#000';
  @Input() height = '37px';
  @Input() width = '100%';
  @Input() backgroundHover = '';
  @Input() radius = '5px';
  @Input() isX = false;
  @Input() padding = '0px 15px';
  @Input() hasOptions = false;
  @Input() optionsAlignment = 'CENTER'
  @Input() iconSize = '23px';
  @Input() isRounded = false;
  @Input() isLoadingSpinnerVisible = false;

  @ViewChild('inner', {static: true}) inner!: ElementRef;
  @ViewChild('options', {static: false}) options!: ElementRef;
  @ViewChild('self') self!: ElementRef;

  isOptionsVisible = false;
  optionSwitch = new Subject<any>();

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.setButtonStyle();
  }

  ngAfterViewInit(): void {
  }

  get style() {
    return {
      'height': this.height,
      'width': this.width
    }
  }

  setButtonStyle() {
    const inner = this.inner.nativeElement;
    if (this.isX) {
      this.width = '40px';
      this.height = '40px';
      this.background = '#f0f2f5';
      this.padding = '0px';
      this.hasOptions = false;
      this.radius = '50%';
      this.color = 'rgba(0, 0, 0, .4)';
    }

    if (this.isRounded) {
      this.radius = '50%';
      this.padding = '0px';
    }

    const style = {
      '--bg': this.background,
      '--fg': this.color,
      'width': this.width,
      '--icon-size': this.iconSize,
      '--padding': this.padding,
      'height': this.height,
      'border-radius': this.radius,
      '--bg-hover': this.backgroundHover || Color(this.background).darken(.1).string()
    }

    for (const [variable, value] of Object.entries(style)) {
      this.renderer.setStyle(inner, variable, value, RendererStyleFlags2.DashCase);
    }
  }

  toggleOptionsVisibility() {
    this.optionSwitch.next({
      target: this.self.nativeElement
    });
    const parent = this.self.nativeElement.parentElement.parentElement;

    if (this.hasOptions) {
      if (this.isOptionsVisible) {
        parent.style['z-index'] = '1';
      }
      else {
        parent.style['z-index'] = '2';
      }
      this.isOptionsVisible = !this.isOptionsVisible;
    }
  }
}
