import {ViewChild, Component, Input, OnInit, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { PhotoViewResponse } from './photo-view-response';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {

  @Input() photo!: PhotoViewResponse | undefined;
  @Input() isComment!: boolean;

  @ViewChild('image', {static: true}) image!: ElementRef;

  showPhotoViewer: boolean = false;
  onPhotoClicked: EventEmitter<boolean> = new EventEmitter();

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {

    // if (this.isComment) {
    //   this.renderer.setStyle(this.image.nativeElement, 'aspect-ratio', '0');
    //   this.renderer.setStyle(this.image.nativeElement, 'height', '100%');
    //   this.renderer.setStyle(this.image.nativeElement, 'width', 'auto');
    // }
  }

  openPhotoView(event: any): void {
    event.preventDefault();
    this.showPhotoViewer = true;    
  }

  closePhotoView(): void {
    this.showPhotoViewer = false;
  }
}
