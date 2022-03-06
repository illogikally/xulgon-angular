import { AfterViewInit, Component, ElementRef, Input, OnInit , 
  Renderer2, RendererStyleFlags2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, AfterViewInit {

  @Input() size = '30px';
  @Input() backgroundColor = 'rgba(0, 0, 0, .3)'
  @Input() color = '#fff';
  @Input() text = 'Loading';
  @Input() displayText = false;
  @Input() isFullScreen = false;

  @ViewChild('spinner') spinnerElement!: ElementRef;

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.configureSpinnerStyle();
  }

  configureSpinnerStyle() {
    const style = {
      '--size': this.size,
      '--color': this.color,
      '--text-size': this.text,
      '--background-color': this.backgroundColor,
      '--text-display': this.displayText ? 'block' : 'none',
      '--position': this.isFullScreen ? 'fixed' : 'absolute'
    }

    for (const [variable, value] of Object.entries(style)) {
      this.renderer.setStyle(
        this.spinnerElement.nativeElement, 
        variable, 
        value, 
        RendererStyleFlags2.DashCase
      );
    }
  }

}

