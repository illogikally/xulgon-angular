import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs';
import {CommentResponse} from './comment-response';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  getCommentsByContent (
    contentId: number, 
    offset: number, 
    size: number
    ): Observable<CommentResponse[]> {
      return this.http.get<CommentResponse[]>(
        `http://localhost:8080/api/contents/${contentId}/comments?offset=${offset}&size=${size}`
      );
  }

  createComment(commentRequest: FormData): Observable<CommentResponse> {
    return this.http.post<CommentResponse>("http://localhost:8080/api/comments", commentRequest);
  }
}
