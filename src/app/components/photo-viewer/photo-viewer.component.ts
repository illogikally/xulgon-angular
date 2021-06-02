import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PhotoResponse } from '../common/photo/photo-response';
import { Location } from '@angular/common';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss']
})
export class PhotoViewerComponent implements OnInit {

  @Input() photoResponse!: PhotoResponse; 
  @Output() closeMe: EventEmitter<boolean> = new EventEmitter();


  
  constructor(private http: HttpClient,
    private location: Location) { }

  ngOnInit(): void {
    this.http.get<PhotoResponse>("http://localhost:8080/api/photos/79")
    this.location.go(`photos/${this.photoResponse.id}`);
  }

  close(): void {
    this.location.back();
    this.closeMe.emit(true);
  }


}
