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
  @ViewChild('img', {static: true}) img!: ElementRef;

  showPhotoViewer: boolean = false;
  onPhotoClicked: EventEmitter<boolean> = new EventEmitter();



  constructor() { }

  ngOnInit(): void {
    console.log(this.photo?.sizeRatio);
    

  }

  openPhotoView(event: any): void {
    event.preventDefault();
    this.showPhotoViewer = true;    
  }

  closePhotoView(): void {
    this.showPhotoViewer = false;
  }
}
