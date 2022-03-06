import { Location, LocationStrategy } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
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
  @Input() isPlaceHolderChild = false;
  @Input() placeHolderOnAttachLisenter?: Observable<any>;

  photoStack: any[] = [];
  isError = false;
  isHidden = true;
  currentHistoryStateId = 0;
  isNavigationReverse = false;
  navigateForward = this.nextPhoto;
  navigateBackward = this.previousPhoto;

  constructor(
    private renderer: Renderer2,
    private location: Location,
    private router: Router,
    private self: ElementRef,
    private photoService: PhotoService
  ) {
  }

  ngOnInit(): void {

    if (this.photoId) {
      this.loadPhoto();
    }
    this.placeHolderOnAttachLisenter?.subscribe(() => this.show());

    this.configureHideOnRouteChange();
    if (!this.isPlaceHolderChild) {
      this.configureOnOpenPhotoViewer();
    }
  }

  ngAfterViewInit(): void {
  }

  configureHideOnRouteChange() {
    this.router.events.subscribe(() => {
      this.isHidden = true;
      this.resumeBodyScroll();
    });
  }

  configureOnOpenPhotoViewer() {
    this.photoService.onOpenPhotoViewerCalled().subscribe(data => {
      if (!this.isHidden) {
        this.photoStack.push({
          setId: this.setId,
          photo: this.photo
        });
      }
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
    this.show();
  }

  hide(): void {
    if (this.photoStack.length) {
      let data = this.photoStack.pop();
      console.log(this.photoStack);
      this.photo = data.photo;
      this.photoId = data.photo.id;
      this.setId = data.setId;
      console.log(data.photo);
      this.location.replaceState(this.constructPhotoUrl());
    }
    else {
      this.location.back();
      this.isHidden = true;
      this.resumeBodyScroll();
      this.photo = undefined;
    }
  }

  resumeBodyScroll() {
    this.renderer.setStyle(this.self.nativeElement, 'display', 'none');
    this.renderer.setStyle(document.body, 'overflow-y', 'scroll');
  }

  show() {
    if (!this.isHidden && !this.isPlaceHolderChild) {
      this.location.replaceState(this.constructPhotoUrl());
    }
    else {
      this.isHidden = false;
      setTimeout(() => {
        this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
        this.renderer.setStyle(this.self.nativeElement, 'display', 'block');
        if (!this.isPlaceHolderChild) {
          console.log('go zom zom');
          
          this.location.go(this.constructPhotoUrl());
        }
      }, 200);
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

  constructPhotoUrl() {
    let url = `photo/${this.photoId}`;
    if (this.setId) {
      url += `?set=${this.setId}`;
    }
    return url;
  }

  updateUrl() {
    if (this.isPlaceHolderChild) {
      this.location.go(this.constructPhotoUrl());
    }
    else {
      // this.location.replaceState(this.constructPhotoUrl());
      window.history.replaceState(null, document.title, this.constructPhotoUrl());
    }
  }
}
