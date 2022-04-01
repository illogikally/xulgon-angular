import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() toggleButtonTop = '10px';
  constructor(
    private renderer: Renderer2
  ) { }

  @ViewChild('sidebar', {static: true}) sidebar!: ElementRef;
  @ViewChild('sidebarInner', {static: true}) sidebarInner!: ElementRef;
  @ViewChild('toggleButton', {static: true}) toggleButton!: ElementRef;

  ngOnInit(): void {
  }

  toggleSidebar() {
    const sidebar = this.sidebar.nativeElement;
    const sidebarInner = this.sidebarInner.nativeElement;
    const toggleButton = this.toggleButton.nativeElement;
    const elems = [sidebar, sidebarInner, toggleButton];
    if (sidebarInner.classList.contains('hide')) {
      elems.forEach(elem => this.renderer.removeClass(elem, 'hide'));
    }
    else {
      elems.forEach(elem => this.renderer.addClass(elem, 'hide'));
    }
  }

  get toggleButtonPosition() {
    return {
      'top': this.toggleButtonTop
    }
  }
}
