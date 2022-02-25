import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PhotoResponse } from './photo-response';
import { PhotoViewResponse } from './photo-view-response';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private baseApiUrl = environment.baseApiUrl;
  public photoView$ = new Subject<any>();
  constructor(
    private http: HttpClient
  ) { }
  
  getPhoto(id: number): Observable<PhotoViewResponse> {
    const url = `${this.baseApiUrl}/photos/${id}`
    return this.http.get<PhotoViewResponse>(url);
  }

  getPhotoBySetIdAndPhotoId(
    setId: number,
    photoId: number,
  ): Observable<PhotoViewResponse> {
    const url = `${this.baseApiUrl}/photo-sets/${setId}/photos/by-id/${photoId}`
    return this.http.get<PhotoViewResponse>(url);
  }

  getPhotoBySetIdAndIndex(
    setId: number,
    index: number,
  ): Observable<PhotoViewResponse> {
    const url = `${this.baseApiUrl}/photo-sets/${setId}/photos/by-index/${index}`
    return this.http.get<PhotoViewResponse>(url);
  }

  getPagePhotoSetId(pageId: number): Observable<number> {
    const url = `${this.baseApiUrl}/pages/${pageId}/photo-set-id`;
    return this.http.get<number>(url);
  }

  getPagePhotos(pageId: number): Observable<PhotoResponse[]> {
    const url = `${this.baseApiUrl}/pages/${pageId}/photos`;
    return this.http.get<PhotoResponse[]>(url);

  }
}
