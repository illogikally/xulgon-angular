import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import {AuthenticationService} from '../authentication/authentication.service';
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
    ): Observable<Array<Post>> {
      let url = `${this.baseApiUrl}/pages/${pageId}/posts?size=${size}&offset=${offset}`;
      return this.http.get<Array<Post>>(url);
  }

  getPost(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseApiUrl}/posts/${postId}`);
  }
}
