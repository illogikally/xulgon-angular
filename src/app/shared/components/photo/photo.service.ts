import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {OffsetResponse} from '../../models/offset-response';
import {OpenPhotoViewData} from './open-photo-view-data';
import {PhotoResponse} from './photo-response';
import {PhotoViewResponse} from './photo-view-response';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private baseApiUrl = environment.baseApiUrl;
  private photoView$ = new Subject<OpenPhotoViewData>();

  constructor(
    private http: HttpClient
  ) { }

  openPhotoView(data: OpenPhotoViewData) {
    this.photoView$.next(data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseApiUrl}/photos/${id}`);
  }

  onOpenPhotoViewerCalled(): Observable<OpenPhotoViewData> {
    return this.photoView$.asObservable();
  }

  getPhoto(id: number): Observable<PhotoViewResponse> {
    const url = `${this.baseApiUrl}/photos/${id}`
    return this.http.get<PhotoViewResponse>(url);
  }

  getPhotoBySetIdAndPhotoId(
    setId: number,
    photoId: number,
  ): Observable<PhotoViewResponse> {
    const url = `${this.baseApiUrl}/photo-sets/${setId}/photos/${photoId}`
    return this.http.get<PhotoViewResponse>(url);
  }

  getPhotoAfter(
    setId: number,
    photoId: number,
  ): Observable<PhotoViewResponse> {
    const url = `${this.baseApiUrl}/photo-sets/${setId}/photos/after/${photoId}`;
    return this.http.get<PhotoViewResponse>(url);
  }

  getPhotoBefore(
    setId: number,
    photoId: number,
  ): Observable<PhotoViewResponse> {
    const url = `${this.baseApiUrl}/photo-sets/${setId}/photos/before/${photoId}`;
    return this.http.get<PhotoViewResponse>(url);
  }

  getPagePhotoSetId(pageId: number): Observable<number> {
    const url = `${this.baseApiUrl}/pages/${pageId}/photo-set-id`;
    return this.http.get<number>(url);
  }

  getPagePhotos(
    pageId: number,
    size: number,
    offset: number
  ): Observable<OffsetResponse<PhotoResponse>> {
    const url = `${this.baseApiUrl}/pages/${pageId}/photos?size=${size}&offset=${offset}`;
    return this.http.get<OffsetResponse<PhotoResponse>>(url);

  }
}
