import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../common/message.service';
import { UserService } from '../../common/user.service';
import { Post } from '../../post/post';

@Component({
  selector: 'app-group-feed',
  templateUrl: './group-feed.component.html',
  styleUrls: ['./group-feed.component.scss']
})
export class GroupFeedComponent implements OnInit {

  groupFeedPosts!: Post[];
  constructor(private message$: MessageService,
    private user$: UserService) { }

  ngOnInit(): void {
    this.user$.getGroupFeed().subscribe(groupFeedPosts => {
      this.groupFeedPosts = groupFeedPosts;
    })
  }

}
