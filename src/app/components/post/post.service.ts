import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import {AuthenticationService} from '../authentication/authentication.service';
import { PageableResponse } from '../share/pageable-response';
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
  ): Observable<PageableResponse<Post>> {
    let url = `${this.baseApiUrl}/pages/${pageId}/posts?size=${size}&offset=${offset}`;
    return this.http.get<PageableResponse<Post>>(url);
  }

  getPost(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseApiUrl}/posts/${postId}`);
  }

  createPost(data: FormData): Observable<Post> {
    return this.http.post<Post>("http://localhost:8080/api/posts", data);
  }

  delete(postId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/posts/${postId}`);
  }
}
