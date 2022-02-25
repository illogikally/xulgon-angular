import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../post.service'
import {Post} from '../post'
import {AuthenticationService} from '../../authentication/authentication.service';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from '../../share/message.service';
import {ReplaySubject} from 'rxjs';
import {UserService} from '../../share/user.service';
import { ProfileService } from '../../profile/profile.service';

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
    private profileService: ProfileService,
    private messageService: MessageService,
  ) {
  }

  ngOnDestroy() {
    this.messageService.loadPostsByPageId(undefined);
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  onPostDelete(postId: number) {
    this.posts = this.posts?.filter(post => post.id != postId);
  }

  ngOnInit(): void {
    this.profileService.onPostCreate$.subscribe(post => {
      if (post.pageId == this.pageId) {
        this.posts?.unshift(post);
      }
    })
  }
}
