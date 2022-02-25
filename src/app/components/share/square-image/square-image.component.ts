import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { PhotoResponse } from '../photo/photo-response';
import {PhotoViewResponse} from '../photo/photo-view-response';

@Component({
  selector: 'app-square-image',
  templateUrl: './square-image.component.html',
  styleUrls: ['./square-image.component.scss']
})
export class SquareImageComponent implements OnInit {

  @Input() photo!: PhotoResponse;
  @Output() photoPicked: EventEmitter<PhotoResponse> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  photoClicked(): void {
    this.photoPicked.emit(this.photo);
  }

}
