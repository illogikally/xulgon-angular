import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() hide!:  Observable<any>; 
  @ViewChild('self') self!: ElementRef;

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(
  ): void {
  }

}
