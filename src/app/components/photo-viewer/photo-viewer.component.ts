import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { PhotoResponse } from '../common/photo/photo-response';
import { Location } from '@angular/common';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss']
})
export class PhotoViewerComponent implements OnInit, OnDestroy {

  @Input() photoResponse!: PhotoResponse | undefined; 
  @Output() closeMe: EventEmitter<boolean> = new EventEmitter();


  
  constructor(private http: HttpClient,
    private renderer: Renderer2,
    private location: Location) { }

  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'overflow-y', 'scroll');
  }

  ngOnInit(): void {
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');

    // this.http.get<PhotoResponse>("http://localhost:8080/api/photos/" + this.photoResponse?.id)
    this.location.go(`photos/${this.photoResponse?.id}`);
  }

  close(): void {
    this.location.back();
    this.closeMe.emit(true);
  }


}
