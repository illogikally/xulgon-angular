import {Injectable} from '@angular/core';
import {ReplaySubject, Subject} from 'rxjs';
import {ActivatedRouteSnapshot} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PostViewService {
  highlight$ = new ReplaySubject<any>(1);
  attach$ = new Subject<number>();
  detach$ = new Subject<number>();
  constructor() { }

  highlight(route: ActivatedRouteSnapshot) {
    let postId = Number(route.paramMap.get('id'));
    const queryParams = route.queryParamMap;
    const commentId = Number(queryParams.get('comment'));
    const childCommentId = Number(queryParams.get('child_comment'));
    const type = queryParams.get('type');

    const data = {
      postId: postId,
      commentId: commentId,
      childCommentId: childCommentId,
      type: type
    }
    this.highlight$.next(data);
  }
}
