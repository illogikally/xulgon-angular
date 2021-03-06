import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {PhotoResponse} from '../../shared/components/photo/photo-response';

@Component({
  selector: 'app-media-layout',
  templateUrl: './media-layout.component.html',
  styleUrls: ['./media-layout.component.scss']
})
export class MediaLayoutComponent implements OnInit, AfterViewInit {

  @Input() photos: PhotoResponse[] = [];
  @Input() photoSetId!: number;
  @Input() photoCount!: number;

  @ViewChild('self') self!: ElementRef;
  @ViewChild('morePhotos') morePhotos!: ElementRef;
  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.photos = this.photos.sort((l, r) => l.id - r.id);
  }

  ngAfterViewInit(): void {
  }

  morePhotoClick(event: any) {
    this.morePhotos.nativeElement.parentElement.children[0].children[0].click();
  }

}
