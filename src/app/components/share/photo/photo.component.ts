import {Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {PhotoService} from './photo.service';

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
  @Input() isPhotoViewNavigationReverse = false;

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

    this.photoService.openPhotoView({
      id: this.id,
      setId: this.setId,
      isNavigationReverse: this.isPhotoViewNavigationReverse
    });
  }
}
