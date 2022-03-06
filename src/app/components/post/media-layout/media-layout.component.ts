import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, RendererStyleFlags2, ViewChild } from '@angular/core';
import { PhotoResponse } from '../../share/photo/photo-response';

@Component({
  selector: 'app-media-layout',
  templateUrl: './media-layout.component.html',
  styleUrls: ['./media-layout.component.scss']
})
export class MediaLayoutComponent implements OnInit, AfterViewInit {

  @Input() photos!: PhotoResponse[];
  @Input() photoSetId!: number;
  @Input() photoCount!: number;

  @ViewChild('self') self!: ElementRef;
  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  morePhotoClick(event: any) {
    event.target.parentElement.children[0].children[0].click();
  }

}
