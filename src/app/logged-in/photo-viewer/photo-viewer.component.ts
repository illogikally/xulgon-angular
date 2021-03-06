import {Location} from '@angular/common';
import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {PhotoViewResponse} from '../../shared/components/photo/photo-view-response';
import {PhotoService} from '../../shared/components/photo/photo.service';
import {PostViewService} from "../../post-view/post-view.service";

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss']
})
export class PhotoViewerComponent implements OnInit, AfterViewInit {

  @Input() photo?: PhotoViewResponse | null;
  @Input() photoId!: number;
  @Input() setId?: number;
  @Input() isPlaceHolderChild = false;
  @Input() placeHolderOnAttachListener?: Observable<any>;

  photoStack: any[] = [];
  nullPhoto = false;
  isHidden = true;
  isNavigationReverse = false;
  navigateForward = this.nextPhoto;
  navigateBackward = this.previousPhoto;

  constructor(
    private renderer: Renderer2,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private self: ElementRef,
    private postViewService: PostViewService,
    private photoService: PhotoService
  ) {
  }

  ngOnInit(): void {
    if (this.isPlaceHolderChild) {
      this.show();
      this.nullPhoto = !this.photo;
      this.placeHolderOnAttachListener?.subscribe(() => this.onAttach());
    } else {
      if (this.photoId) {
        this.getPhoto();
      }

      this.configureHideOnRouteChange();
      if (!this.isPlaceHolderChild) {
        this.listenOnOpenCalled();
      }
    }
  }

  onAttach() {
    this.show();
  }

  ngAfterViewInit(): void {
  }

  configureHideOnRouteChange() {
    let willHide = false;
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        const currentUrl = '/' + window.location.href.split('/').slice(3).join('/');
        const futureUrl = e.url.replace(/\?.*$/g, '');

        willHide = currentUrl != futureUrl;
      }

      if (e instanceof NavigationEnd) {
        if (willHide) {
          willHide = false;
          this.isHidden = true;
          this.resumeBodyScroll();
        }
      }
    });
  }


  listenOnOpenCalled() {
    this.photoService.onOpenPhotoViewerCalled().subscribe(data => {
      this.photoStack.push({
        setId: this.setId,
        photo: this.photo,
        url: this.isHidden
          ? window.location.pathname + window.location.search
          : this.constructPhotoUrl()
      });
      this.photoId = data.id;
      this.setId = data.setId;
      this.configureNavigation(data.isNavigationReverse);
      this.getPhoto();
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

  getPhoto() {
    const observer = this.setId
        ? this.photoService.getPhotoBySetIdAndPhotoId(this.setId, this.photoId)
        : this.photoService.getPhoto(this.photoId);

    observer.pipe(catchError(() => of(null))).subscribe(photo => {
      this.nullPhoto = !photo;
      this.photo = photo;
      this.show();
    });
  }

  @HostListener('window:popstate')
  onPopState() {
    if (!this.isPlaceHolderChild && !this.isHidden) {
      this.isHidden = true;
      this.hide();
    }
  }

  hide(): void {
    if (this.photoStack.length <= 1) {
      this.resumeBodyScroll();
      this.isHidden = true;
      this.photo = undefined;
    }

    let data = this.photoStack.pop();
    this.photo = data?.photo;
    this.photoId = data?.photo?.id;
    this.setId = data?.setId;
    this.location.replaceState(data.url);

  }

  resumeBodyScroll() {
    this.renderer.setStyle(this.self.nativeElement, 'display', 'none');
    this.renderer.setStyle(document.body, 'overflow-y', 'scroll');
  }

  show() {
    this.isHidden = false;

    if (!this.photo && !this.isPlaceHolderChild) {
      window.location.reload();
    }


    if (!this.isPlaceHolderChild) {
      this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
      this.location.go(this.constructPhotoUrl());
    }
    this.renderer.setStyle(this.self.nativeElement, 'display', 'block');
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
      this.location.replaceState(this.constructPhotoUrl());
    }
  }
}
