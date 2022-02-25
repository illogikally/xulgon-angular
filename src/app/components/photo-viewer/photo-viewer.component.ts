import {HttpClient} from '@angular/common/http';
import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {PhotoViewResponse} from '../share/photo/photo-view-response';
import {Location} from '@angular/common';
import { MessageService } from '../share/message.service';
import { PhotoService } from '../share/photo/photo.service';
import { Post } from '../post/post';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss']
})
export class PhotoViewerComponent implements OnInit {

  @Input() photo?: PhotoViewResponse;
  @Input() photoId!: number;
  @Input() setId?: number;

  post!: Post;
  constructor(
    private renderer: Renderer2,
    private location: Location,
    private self: ElementRef,
    private photoService: PhotoService

  ) {
  }

  ngOnInit(): void {
    if (this.photoId) {
      this.loadPhoto();
    }

    this.photoService.photoView$.subscribe(data => {
      this.photoId = data.id;
      this.setId = data.setId;
      this.loadPhoto();
    });
  }
  

  loadPhoto() {
    if (this.setId) {
      this.photoService.getPhotoBySetIdAndPhotoId(this.setId, this.photoId)
      .subscribe(photo => {
        this.photo = photo;
        setTimeout(() => {
          this.show();
        }, 200);
      });
    }
    else {
      this.photoService.getPhoto(this.photoId).subscribe(photo => {
        this.photo = photo;
        setTimeout(() => {
          this.show();
        }, 200);
      });
    }
  }

  hide(): void {
    this.location.back();
    this.renderer.setStyle(this.self.nativeElement, 'display', 'none');
    this.renderer.setStyle(document.body, 'overflow-y', 'scroll');
    this.photo = undefined;
  }

  show() {
    let url = `photos/${this.photoId}`;
    if (this.setId) {
      url += `?set_id=${this.setId}`;
    }
    this.location.go(url);
    this.renderer.setStyle(this.self.nativeElement, 'display', 'block');
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
  }

  nextPhoto() {
    if (!this.setId || !this.photo?.index) return;
    this.photoService.getPhotoBySetIdAndIndex(this.setId, this.photo.index + 1)
    .subscribe(photo => {
      this.photo = photo;
    });
  }

  previousPhoto() {
    if (!this.setId || !this.photo?.index) return;

    this.photoService.getPhotoBySetIdAndIndex(this.setId, this.photo.index - 1)
    .subscribe(photo => {
      this.photo = photo;
    });
  }
}
