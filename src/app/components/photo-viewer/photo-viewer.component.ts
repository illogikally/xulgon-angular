import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { PhotoViewResponse } from '../common/photo/photo-view-response';
import { Location } from '@angular/common';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss']
})
export class PhotoViewerComponent implements OnInit, OnDestroy {

  @Input() photoResponse!: PhotoViewResponse | undefined; 
  @Output() closeMe: EventEmitter<boolean> = new EventEmitter();
  prevUrl: string[] = [];
  
  constructor(private http: HttpClient,
    private router: Router,
    private renderer: Renderer2,
    private location: Location) { }

  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'overflow-y', 'scroll');
  }

  // @HostListener('window:popstate', ['$event'])
  // onPopState(event: any) {
  //   this.close();
  // }
  ngOnInit(): void {
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');


    this.http.get<PhotoViewResponse>("http://localhost:8080/api/photos/" + this.photoResponse?.id)
        .subscribe(resp => {
          this.photoResponse = resp;
        });
    this.prevUrl.push(window.location.href.replace(/https?:\/\/.*?\//g, ''));
    this.location.go(`photos/${this.photoResponse?.id}`);
  }

  close(): void {
    this.location.back();
    this.closeMe.emit(true);
  }


}
