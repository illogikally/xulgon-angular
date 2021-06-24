import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../common/message.service';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})
export class PhotoListComponent implements OnInit {

  photos: any[] = [];

  constructor(private http: HttpClient,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.pageId.subscribe(pageId => {
      if (!pageId) return;

      this.http.get<any[]>(`http://localhost:8080/api/pages/${pageId}/photos`).subscribe(photos => {
        this.photos = photos;
      });
    })
  }

  photoDeleted(id: any) {
    this.photos = this.photos.filter(photo => photo.id != id);
  }

}
