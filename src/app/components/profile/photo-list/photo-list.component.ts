import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MessageService } from '../../share/message.service';
import { PhotoService } from '../../share/photo/photo.service';
import { PageHeader } from '../page-header';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})

export class PhotoListComponent implements OnInit, OnDestroy {

  photos: any[] = [];
  photoSetId!: number;
  private destroyed$ =  new ReplaySubject<boolean>(1);

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private photoService: PhotoService
  ) { }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    let id = Number(this.activatedRoute.parent?.snapshot.paramMap.get('id'));
    if (id !== NaN) {
      this.photoService.getPagePhotos(id).subscribe(photos => {
        this.photos = photos;
      });

      this.photoService.getPagePhotoSetId(id).subscribe(photoSetId => {
        this.photoSetId = photoSetId;
      });

    }
  }

  photoDeleted(id: any) {
    this.photos = this.photos.filter(photo => photo.id != id);
  }

}
