import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { CommentResponse } from './comment-response';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getCommentsByContent(contentId: number): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(`http://localhost:8080/api/content/${contentId}/comments`);
  }
}
