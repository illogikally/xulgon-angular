import {ViewChild, Component, Input, OnInit, ElementRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {

  @Input() photo!: any;
  @Input() style!: string;
  @ViewChild('img', {static: true}) img!: ElementRef;

  showPhotoViewer: boolean = false;
  onPhotoClicked: EventEmitter<boolean> = new EventEmitter();



  constructor() { }

  ngOnInit(): void {
    this.img.nativeElement.style[this.style] = '100%';
  }

  openPhotoView(event: any): void {
    event.preventDefault();
    this.showPhotoViewer = true;    
  }

  closePhotoView(): void {
    this.showPhotoViewer = false;
  }
}
