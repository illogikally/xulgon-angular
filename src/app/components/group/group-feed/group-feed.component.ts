import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../post/post';
import { UserService } from '../../share/user.service';

@Component({
  selector: 'app-group-feed',
  templateUrl: './group-feed.component.html',
  styleUrls: ['./group-feed.component.scss']
})
export class GroupFeedComponent implements OnInit, OnDestroy {

  groupFeedPosts: Post[] = [];

  constructor(
    private userService: UserService
  ) {
  }

  ngOnDestroy(): void {
    console.log('diestry');
  }

  ngOnInit(): void {
    this.userService.getGroupFeed().subscribe(posts => {
      this.groupFeedPosts = posts;
    })
  }

}
