import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import {AuthenticationService} from '../authentication/authentication.service';
import { OffsetResponse } from '../share/offset-response';
import { UserBasic } from '../share/user-basic';
import {Post} from './post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(
    private http: HttpClient, 
    ) {
  }
  getPostsByPageId(
    pageId: number,
    size  : number,
    offset: number
  ): Observable<OffsetResponse<Post>> {
    let url = `${this.baseApiUrl}/pages/${pageId}/posts?size=${size}&offset=${offset}`;
    return this.http.get<OffsetResponse<Post>>(url);
  }

  getPost(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseApiUrl}/posts/${postId}`);
  }

  createPost(data: FormData): Observable<Post> {
    const url = `${this.baseApiUrl}/posts`
    return this.http.post<Post>(url, data);
  }

  delete(postId: number): Observable<any> {
    const url = `${this.baseApiUrl}/posts/${postId}`
    return this.http.delete(url);
  }

  getCommenters(postId: number): Observable<UserBasic[]> {
    const url = `${this.baseApiUrl}/posts/${postId}/commenters`
    return this.http.get<UserBasic[]>(url);
  }
}
