import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PhotoViewResponse } from '../photo/photo-view-response';

@Component({
  selector: 'app-square-image',
  templateUrl: './square-image.component.html',
  styleUrls: ['./square-image.component.scss']
})
export class SquareImageComponent implements OnInit {

  @Input() photo!: PhotoViewResponse;
  @Output() photoPicked: EventEmitter<PhotoViewResponse> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  photoClicked(): void {
    console.log('click');
    
    this.photoPicked.emit(this.photo);
  }

}
