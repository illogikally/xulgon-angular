import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable, Subject} from 'rxjs';
import {CommentResponse} from './comment-response';
import {environment} from 'src/environments/environment';
import { PageableResponse } from '../../share/pageable-response';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  public commentAdded$ = new Subject<any>();

  private baseApiUrl = environment.baseApiUrl;
  constructor(private http: HttpClient) {}

  getCommentsByContent(
    contentId: number,
    offset   : number,
    size     : number
  ): Observable<PageableResponse<CommentResponse>> {
    const url = `${this.baseApiUrl}/contents/${contentId}/comments?offset=${offset}&size=${size}`;
    return this.http.get<PageableResponse<CommentResponse>>(url);
  }

  createComment(commentRequest: FormData): Observable<CommentResponse> {
    const url = `${this.baseApiUrl}/comments`;
    return this.http.post<CommentResponse>(url, commentRequest);
  }

  getComment(id: number): Observable<CommentResponse> {
    const url = `${this.baseApiUrl}/comments/${id}`
    return this.http.get<CommentResponse>(url);
  }
}
