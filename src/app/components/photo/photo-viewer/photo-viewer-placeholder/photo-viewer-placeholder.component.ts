import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from 'src/app/components/share/photo/photo.service';

@Component({
  selector: 'app-photo-viewer-placeholder',
  templateUrl: './photo-viewer-placeholder.component.html',
  styleUrls: ['./photo-viewer-placeholder.component.scss']
})
export class PhotoViewerPlaceholderComponent implements OnInit {


  id!: number;
  setId?: number;
  constructor(
    private route: ActivatedRoute,
    private photoService: PhotoService
  ) { 
  }

  ngOnInit(): void {
    this.configureOpenPhotoViewer();
  }

  configureOpenPhotoViewer() {
    const paramMap = this.route.snapshot.paramMap;
    const queryParamMap = this.route.snapshot.queryParamMap;

    const photoId = Number(paramMap.get('id'));
    const photoSetId = queryParamMap.get('set');
    
    this.id = photoId;
    this.setId = Number(photoSetId) || undefined;
    console.log(this.id, this.setId);
    
  }

}
