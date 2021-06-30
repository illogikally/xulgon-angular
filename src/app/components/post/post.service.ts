import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postApi = 'http://localhost:8080/api/posts/';
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getPostsByPageId(pageId: number): Observable<Array<Post>> {
    return this.http.get<Array<Post>>(`http://localhost:8080/api/pages/${pageId}/posts`); 
  }

  getPost(postId: number): Observable<Post> {
    return this.http.get<Post>(this.postApi + postId);
  }
}
