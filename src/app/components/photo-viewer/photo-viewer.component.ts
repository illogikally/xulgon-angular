import { Location, LocationStrategy } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PhotoViewResponse } from '../share/photo/photo-view-response';
import { PhotoService } from '../share/photo/photo.service';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss']
})
export class PhotoViewerComponent implements OnInit, AfterViewInit {

  @Input() photo?: PhotoViewResponse;
  @Input() photoId!: number;
  @Input() setId?: number;
  @Input() isPage = false;

  isError = false;
  currentHistoryStateId = 0;
  isNavigationReverse = false;
  navigateForward = this.nextPhoto;
  navigateBackward = this.previousPhoto;
  constructor(
    private renderer: Renderer2,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private router: Router,
    private self: ElementRef,
    private photoService: PhotoService
  ) {
  }

  ngOnInit(): void {
    if (this.photoId) {
      this.loadPhoto();
    }

    this.configureHideOnRouteChange();
    if (!this.isPage) {
      this.configureOnDisplayPhotoViewer();
    }
  }

  ngAfterViewInit(): void {
  }

  configureHideOnRouteChange() {
    
    this.router.events.subscribe(() => {
      this.giveBackBodyScroll();
    });
  }

  configureOnDisplayPhotoViewer() {
    this.photoService.onOpenPhotoViewCalled().subscribe(data => {
      this.photoId = data.id;
      this.setId = data.setId;
      this.configureNavigation(data.isNavigationReverse);
      this.loadPhoto();
    });
  }

  configureNavigation(isReverse: boolean) {
    this.isNavigationReverse = isReverse;
    this.navigateBackward = isReverse ? this.nextPhoto : this.previousPhoto;
    this.navigateForward = isReverse ? this.previousPhoto : this.nextPhoto;
  }

  getHasPreviousHasNext() {
    return this.isNavigationReverse 
      ? [this.photo?.hasNext, this.photo?.hasPrevious]
      : [this.photo?.hasPrevious, this.photo?.hasNext];
  }

  loadPhoto() {
    if (this.setId) {
      this.photoService.getPhotoBySetIdAndPhotoId(this.setId, this.photoId)
      .subscribe(this.resolveLoadedPhoto.bind(this), 
      error => {
        this.isError = true;
      });
    }
    else {
      this.photoService.getPhoto(this.photoId).subscribe(this.resolveLoadedPhoto.bind(this),
      error => {
        this.isError = true;
      });
    }
  }

  resolveLoadedPhoto(photo: PhotoViewResponse) {
    this.photo = photo;

    if (photo == null) {
      this.isError = true;
    }

    setTimeout(() => {
      this.show();
    }, 200);
  }

  hide(): void {
    this.giveBackBodyScroll();
    this.photo = undefined;
    this.location.back();
  }

  giveBackBodyScroll() {
    this.renderer.setStyle(this.self.nativeElement, 'display', 'none');
    this.renderer.setStyle(document.body, 'overflow-y', 'scroll');
  }

  show() {
    this.renderer.setStyle(this.self.nativeElement, 'display', 'block');
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
    if (!this.isPage) {
      this.location.go(this.getUrl());
    }
  }

  nextPhoto() {
    this.fetchPhoto(this.photoService.getPhotoAfter);
  }

  previousPhoto() {
    this.fetchPhoto(this.photoService.getPhotoBefore);
  }

  fetchPhoto(get: (setId: number, photoId: number) => Observable<PhotoViewResponse>) {
    if (!this.setId) return;

    get.call(this.photoService, this.setId, this.photoId)
    .subscribe(photo => {
      this.photo = photo;
      this.photoId = photo.id;
      this.updateUrl();
    });
  }

  getUrl() {
    let url = `photo/${this.photoId}`;
    if (this.setId) {
      url += `?set=${this.setId}`;
    }
    return url;
  }

  updateUrl() {
    if (this.isPage) {
      this.location.go(this.getUrl());
    }
    else {
      this.location.replaceState(this.getUrl());
    }
  }

}
