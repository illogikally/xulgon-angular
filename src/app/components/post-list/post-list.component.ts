import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../post/post.service'
import {Post} from '../post/post'
import {AuthenticationService} from '../authentication/authentication.service';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from '../share/message.service';
import {ReplaySubject} from 'rxjs';
import {UserService} from '../share/user.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  @Input() pageId: number | undefined;
  @Input() posts: Post[] = [];
  @Input() isLoading = false;

  @Input() isGroupNameVisible = false;
  @Input() isCommentVisible = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,
    private postService: PostService,
    private authService: AuthenticationService) {
  }

  ngOnDestroy() {
    this.messageService.loadPostsByPageId(undefined);
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.messageService.postDeleted.asObservable()
      .subscribe(id => {
        this.posts = this.posts?.filter(post => post.id != id);
      });

    // this.message$.onLoadPostsByPageId()
    // .pipe(takeUntil(this.destroyed$))
    // .subscribe(id => {

    //   if (id === undefined) return;
    //   this.pageId = id;
    //   this.loadPosts(id);
    // });

    this.messageService.onCreatedPost().subscribe(post => {
      if (post.pageId == this.pageId) {
        this.posts?.unshift(post);
      }
    });
  }

  loadPosts(pageId: number): void {
    if (!pageId) return;

    // this.post$.getPostsByPageId(pageId)
    //   .subscribe(posts => {
    //       this.posts = posts;
    //       this.isLoadingPost = false;
    //     },
    //     error => {
    //       this.isLoadingPost = false;
    //     });

  }
}
