import { Component, ElementRef, Input, OnInit, Renderer2, RendererStyleFlags2, ViewChild } from '@angular/core';
import * as Color from 'color';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() background = '#d8dadf';
  @Input() color = '#050505';
  @Input() height = '37px';
  @Input() width = 'auto';
  @Input() backgroundHover = '';
  @Input() radius = '5px';
  @Input() isX = false;
  @Input() padding = '0 15px';
  @Input() hasOptions = false;
  @Input() optionsAlignment = 'CENTER'

  @ViewChild('inner', {static: true}) inner!: ElementRef;

  isOptionsVisible = false;
  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.setButtonStyle();
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
      this.padding = '';
      this.hasOptions = false;
      this.radius = '50%';
      this.color = 'rgba(#555, .9)';
    }

    const style = {
      '--bg': this.background,
      '--fg': this.color,
      'width': this.width,
      'padding': this.padding,
      'height': this.height,
      'border-radius': this.radius,
      '--bg-hover': this.backgroundHover || Color(this.background).darken(.1).string()
    }

    for (const [variable, value] of Object.entries(style)) {
      this.renderer.setStyle(inner, variable, value, RendererStyleFlags2.DashCase);
    }
  }

  get optionsStyle() {
    let style = {};
    switch (this.optionsAlignment) {
      case 'LEFT': style = { left: '0' }; break;

      case 'CENTER': 
        style = {
          left: '50%',
          transform: 'translateX(-50%)'
        };
        break;

      case 'RIGHT': style = { right: '0' }; break;
    }
    return style;
  }

  toggleOptionsVisibility() {
    if (this.hasOptions) {
      this.isOptionsVisible = !this.isOptionsVisible;
    }
  }

}
