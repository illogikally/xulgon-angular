import {Component, ElementRef, EventEmitter, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { PhotoResponse } from './photo-response';
import {PhotoViewResponse} from './photo-view-response';
import { PhotoService } from './photo.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  @Input() isComment = false;
  @Input() url = '';
  @Input() id?: number;
  @Input() setId?: number;

  @ViewChild('image', {static: true}) image!: ElementRef;

  onPhotoClicked: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private photoService: PhotoService
  ) {
  }

  ngOnInit(): void {
  }

  openPhotoView(event: any): void {
    event.preventDefault();
    if (!this.id) return;
    console.log(this.setId);
    
    this.photoService.photoView$.next({
      id: this.id,
      setId: this.setId
    });
  }
}
