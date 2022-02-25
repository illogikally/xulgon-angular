import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, RendererStyleFlags2, ViewChild } from '@angular/core';
import * as Color from 'color';
import { Subject } from 'rxjs';
import { MessageService } from '../message.service';

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
  @Input() iconSize = '23px';
  @Input() isRounded = false;

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

    if (this.isRounded) {
      this.radius = '50%';
      this.padding = '';
    }
    const style = {
      '--bg': this.background,
      '--fg': this.color,
      'width': this.width,
      '--icon-size': this.iconSize,
      'padding': this.padding,
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
    if (this.hasOptions) {
      this.isOptionsVisible = !this.isOptionsVisible;
    }
  }
}
