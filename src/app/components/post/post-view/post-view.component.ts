import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Route} from '@angular/router';
import {MessageService} from '../../share/message.service';
import {Post} from '../post';
import {PostService} from '../post.service';
import { filter, throttle, throttleTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PostViewService } from './post-view.service';
import { GroupService } from '../../group/group.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss']
})
export class PostViewComponent implements OnInit {

  @Input() isGroup = false;
  @Input() groupId!: number | undefined;
  post!: Post;
  isAttached = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private postViewService: PostViewService,
    private postService: PostService,
    private groupService: GroupService,
  ) {}

  ngOnInit(): void {
    let postId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getPost(postId);
    this.highlightComment(this.activatedRoute.snapshot);
    this.onRouteReuse().subscribe(route => this.highlightComment(route));

    this.groupService.attach$.pipe(filter(id => this.groupId == id)).subscribe(() => this.onAttach());
    this.groupService.detach$.pipe(filter(id => this.groupId == id)).subscribe(() => this.onDetach());
  }

  highlightComment(route: ActivatedRouteSnapshot) {
    let postId = Number(route.paramMap.get('id'));
    const queryParams = route.queryParamMap;
    const commentId = Number(queryParams.get('comment'));
    const childCommentId = Number(queryParams.get('child_comment'));

    const data = {
      postId: postId,
      commentId: commentId,
      childCommentId: childCommentId
    }

    this.postViewService.highlight$.next(data);
  }

  onRouteReuse(): Observable<any> {
    return this.messageService.routeReuse$.pipe(
      filter(route => this.compareRoute(route, this.activatedRoute.snapshot)),
      throttleTime(1e3)
    );
  }

  compareRoute(
    left: ActivatedRouteSnapshot,
    right: ActivatedRouteSnapshot
  ): boolean {
    return left.routeConfig?.component?.name == right.routeConfig?.component?.name;
  }

  getPost(postId: number) {
    if (isNaN(postId)) return;
    this.postService.getPost(postId).subscribe(post => {
      this.post = post;
    });
  }

  onAttach() {
    // Prevent getting called twice on attach
    if (!this.isAttached) {
      this.postViewService.attach$.next(this.post.id);
      this.highlightComment(this.activatedRoute.snapshot);
      this.isAttached = true;
    }
  }

  onDetach() {
    this.isAttached = false;
    this.postViewService.detach$.next(this.post.id);
    this.postViewService.highlight$.next(null);
  }

}

