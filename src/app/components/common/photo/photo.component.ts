import {ViewChild, Component, Input, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { PhotoResponse } from './photo-response';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {

  @Input() photo!: PhotoResponse;
  @Input() style!: string;
  @Input() isComment!: boolean;
  @ViewChild('img', {static: true}) img!: ElementRef;

  showPhotoViewer: boolean = false;
  onPhotoClicked: EventEmitter<boolean> = new EventEmitter();



  constructor() { }

  ngOnInit(): void {
    if (this.isComment) {
      this.img.nativeElement.style['aspect-ratio'] = '0';
      this.img.nativeElement.style['height'] = '100%';
      this.img.nativeElement.style['width'] = 'auto';
    }
  }

  openPhotoView(event: any): void {
    event.preventDefault();
    this.showPhotoViewer = true;    
  }

  closePhotoView(): void {
    this.showPhotoViewer = false;
  }
}
