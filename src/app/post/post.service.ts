import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {OffsetResponse} from '../shared/models/offset-response';
import {UserBasic} from '../shared/models/user-basic';
import {Post} from './post';
import {SharedContent} from './shared-content';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseApiUrl = environment.baseApiUrl;
  private groupShareSelector$ = new Subject<SharedContent>();
  private createPost$ = new Subject<any>();
  postDeleted$ = new Subject<number>();

  constructor(
    private http: HttpClient,
    ) {
  }

  openCreatePost(data: any) {
    this.createPost$.next(data);
  }

  onOpenCreatePostCalled(): Observable<any> {
    return this.createPost$.asObservable();
  }

  openGroupShareSelector(content: SharedContent) {
    this.groupShareSelector$.next(content);
  }

  onOpenGroupShareSelectorCalled(): Observable<SharedContent> {
    return this.groupShareSelector$.asObservable();
  }

  getPostsByProfile(
    pageId: number,
    size  : number,
    before: number
  ): Observable<OffsetResponse<Post>> {
    let url = `${this.baseApiUrl}/pages/${pageId}/posts?size=${size}${before ? '&before=' + before : ''}`;
    return this.http.get<OffsetResponse<Post>>(url);
  }

  getPostsByGroup(
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
