import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, throttleTime} from 'rxjs/operators';
import {GroupService} from '../group/group.service';
import {MessageService} from '../shared/services/message.service';
import {TitleService} from '../shared/services/title.service';
import {Post} from '../post/post';
import {PostService} from '../post/post.service';
import {PostViewService} from './post-view.service';

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
  notFound = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private postViewService: PostViewService,
    private postService: PostService,
    private titleService: TitleService,
    private self: ElementRef,
    private groupService: GroupService,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Xulgon');
    let postId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getPost(postId);
    this.postViewService.highlight(this.activatedRoute.snapshot);
    this.onRouteReuse().subscribe(route => this.postViewService.highlight(route));

    this.groupService.attach$.pipe(
      filter(id => this.groupId == id)
    ).subscribe(() => this.onAttach());

    this.groupService.detach$.pipe(
      filter(id => this.groupId == id)
    ).subscribe(() => this.onDetach());
  }

  scrollToView() {
    setTimeout(() => {
      this.self.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    }, 500);
  }

  onRouteReuse(): Observable<any> {
    return this.messageService.routeReuse$.pipe(
      filter(route => this.compareRoute(route, this.activatedRoute.snapshot)),
      // Get called twice?
      throttleTime(1e3)
    );
  }

  compareRoute(
    left: ActivatedRouteSnapshot,
    right: ActivatedRouteSnapshot
  ): boolean {
    return left.routeConfig?.path == right.routeConfig?.path;
  }

  getPost(postId: number) {
    if (isNaN(postId)) {
      this.notFound = true;
      return;
    }

    this.postService.getPost(postId).subscribe(post => {
      if (!post) {
        this.notFound = true;
        return;
      }
      this.post = post;
    });
  }

  onAttach() {
    // Prevent getting called twice on attach
    if (!this.isAttached) {
      this.postViewService.attach$.next(this.post?.id);
      this.postViewService.highlight(this.activatedRoute.snapshot);
      this.isAttached = true;
    }
  }

  onDetach() {
    this.isAttached = false;
    this.postViewService.detach$.next(this.post?.id);
    this.postViewService.highlight$.next(null);
  }

  onDelete() {
    this.notFound = true;
  }
}

