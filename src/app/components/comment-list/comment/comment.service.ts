import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { CommentResponse } from './comment-response';
import { CommentRequest } from './comment-request'
import { ReactionService } from 'src/app/components/common/reaction.service'
import { ReactionType } from '../../common/reaction-type';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getCommentsByContent(contentId: number): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(`http://localhost:8080/api/content/${contentId}/comments`);
  }

  createComment(commentRequest: CommentRequest): Observable<CommentResponse> {
    return this.http.post<CommentResponse>("http://localhost:8080/api/comment", commentRequest);
  }
}
