import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PostService } from '../post/post.service'
import { Post } from '../post/post'
import { AuthenticationService } from '../authentication/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../common/message.service';
import { ReplaySubject, Subscriber, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../common/user.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  @Input() pageId!: number ;
  @Input() posts: Post[] | undefined;

  isLoadingPost = true;
  @Input() showGroup!: boolean;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private activatedRoute: ActivatedRoute,
    private user$: UserService,
    private message$: MessageService,
    private post$: PostService,
    private auth$: AuthenticationService) {
  }

  ngOnDestroy() {
    this.message$.loadPostsByPageId(undefined);
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    console.log(this.posts);
    
    this.message$.postDeleted.asObservable()
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

    this.message$.onCreatedPost().subscribe(post => {
      if (post.pageId == this.pageId) {
        this.posts?.unshift(post);
      }
    });
  }

  loadPosts(pageId: number): void {
    if (!pageId) return;

    this.post$.getPostsByPageId(pageId)
    .subscribe(posts => {
      this.posts = posts;
      this.isLoadingPost = false;
    },
    error => {
      this.isLoadingPost = false;
    });
      
  }
}
