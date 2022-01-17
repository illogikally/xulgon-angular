import {HttpClient} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ReplaySubject} from 'rxjs';
import {MessageService} from '../../common/message.service';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})

export class PhotoListComponent implements OnInit, OnDestroy {

  photos: any[] = [];
  private destroyed$ = new ReplaySubject<boolean>(1);

  constructor(private http: HttpClient,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    let id = Number(this.activatedRoute.parent?.snapshot.paramMap.get('id'));
    if (id !== NaN) {
      this.http.get<any[]>(`http://localhost:8080/api/pages/${id}/photos`).subscribe(photos => {
        this.photos = photos;
      });
    }
    //   this.messageService.onLoadPostsByPageId()
    //   .pipe(takeUntil(this.destroyed$))
    //   .subscribe(pageId => {
    //     if (pageId === undefined) return;
    //     this.http.get<any[]>(`http://localhost:8080/api/pages/${pageId}/photos`).subscribe(photos => {
    //       this.photos = photos;
    //     });
    //   })
  }

  photoDeleted(id: any) {
    this.photos = this.photos.filter(photo => photo.id != id);
  }

}
