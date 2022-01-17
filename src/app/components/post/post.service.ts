import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../authentication/authentication.service';
import {Post} from './post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postApi = 'http://localhost:8080/api/posts/';

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
  }

  getPostsByPageId(
    pageId: number,
    size  : number,
    offset: number): Observable<Array<Post>> {
      let url = `http://localhost:8080/api/pages/${pageId}/posts?size=${size}&offset=${offset}`;
      return this.http.get<Array<Post>>(url);
  }

  getPost(postId: number): Observable<Post> {
    return this.http.get<Post>(this.postApi + postId);
  }
}
