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
  @Input() position: 'fixed' | 'absolute' | 'relative' = 'absolute';
  @Input() text = 'Loading';
  @Input() displayText = false;
  @Input() isFullScreen = false;
  @Input() ringWidth = '3px';

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
    const position = this.isFullScreen ? 'fixed' : this.position;
    const style = {
      '--size': this.size,
      '--color': this.color,
      '--ring-width': this.ringWidth,
      '--text-size': this.text,
      '--background-color': this.backgroundColor,
      '--text-display': this.displayText ? 'block' : 'none',
      '--position': position
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

