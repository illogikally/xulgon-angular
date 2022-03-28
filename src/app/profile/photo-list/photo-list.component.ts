import {AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {fromEvent, merge, of, ReplaySubject, Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {PhotoService} from '../../shared/components/photo/photo.service';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})

export class PhotoListComponent implements OnInit, OnDestroy, AfterViewInit {

  photos: any[] = [];
  photoSetId!: number;
  private destroyed$ =  new ReplaySubject<boolean>(1);
  @ViewChild('self') self!: ElementRef;

  pageId!: number;
  hasNext = true;
  isLoading = false;

  onAttach$ = new Subject<any>();
  onDetach$ = new Subject<any>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private photoService: PhotoService,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) { }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.pageId = Number(this.activatedRoute.parent?.snapshot.paramMap.get('id'));
    if (this.pageId !== NaN) {
      this.photoService.getPagePhotoSetId(this.pageId).subscribe(photoSetId => {
        this.photoSetId = photoSetId;
      });
      this.configureInitGetPhotos();
    }
  }

  ngAfterViewInit() {
    this.configureOnResize();
    this.configureLoadPhotoOnScroll();
  }

  async configureInitGetPhotos() {
    for (let i = 0; i < 2; ++i) {
      await this.getPhotos();
    }
  }

  async getPhotos() {
    if (!this.hasNext) return;
    const size = 6;
    const offset = this.photos.length;
    this.isLoading = true;

    const response = await this.photoService.getPagePhotos(this.pageId, size, offset).toPromise();
    this.photos = this.photos.concat(response.data);
    this.hasNext = response.hasNext;
    this.isLoading = false;
  }

  onAttach() {
    this.onAttach$.next();
  }

  onDetach() {
    this.onAttach$.next();
  }

  configureLoadPhotoOnScroll() {
    merge(
      of(null),
      this.onAttach$
    ).pipe(
      switchMap(() => fromEvent(window, 'scroll')
        .pipe(takeUntil(this.onDetach$))
      )
    ).subscribe(() => {
      const self = this.self.nativeElement.getBoundingClientRect();
      if (
        window.scrollY >= self.bottom - 1.2*window.innerHeight
        && !this.isLoading
        && this.hasNext
      ) {
        this.getPhotos();
      }
    })
  }

  photoDeleted(id: any) {
    this.photos = this.photos.filter(photo => photo.id != id);
  }

  configureOnResize() {
    const self = this.self.nativeElement;
    const columnWidth = 892 / 6;
    let prevColumns = 0;
    new ResizeObserver(entries => {
      if (!entries[0].contentRect.width) return;
      this.ngZone.run(() => {
        const currentColumns = Math.floor(self.offsetWidth / columnWidth);
        if (currentColumns != prevColumns) {
          this.renderer.setStyle(
            self,
            'grid-template-columns',
            `repeat(${currentColumns}, 1fr)`
          );
        }
        prevColumns = currentColumns;
      });
    }).observe(self);
  }
}
