import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {OffsetResponse} from '../../../shared/models/offset-response';
import {CommentResponse} from './comment-response';

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
  ): Observable<OffsetResponse<CommentResponse>> {
    const url = `${this.baseApiUrl}/contents/${contentId}/comments?offset=${offset}&size=${size}`;
    return this.http.get<OffsetResponse<CommentResponse>>(url);
  }

  createComment(commentRequest: FormData): Observable<CommentResponse> {
    const url = `${this.baseApiUrl}/comments`;
    return this.http.post<CommentResponse>(url, commentRequest);
  }

  getComment(id: number): Observable<CommentResponse> {
    const url = `${this.baseApiUrl}/comments/${id}`
    return this.http.get<CommentResponse>(url);
  }

  delete(commentId: number): Observable<any> {
    const url = `${this.baseApiUrl}/comments/${commentId}`;
    return this.http.delete(url);
  }
}
