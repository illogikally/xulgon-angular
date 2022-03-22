import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/components/authentication/authentication.service';
import { PostService } from 'src/app/components/post/post.service';
import { GroupResponse } from '../../group-response';

@Component({
  selector: 'app-group-create-post',
  templateUrl: './group-create-post.component.html',
  styleUrls: ['./group-create-post.component.scss']
})
export class GroupCreatePostComponent implements OnInit {

  @Input() groupResponse!: GroupResponse;
  @Input() isGroup = true;

  constructor(
    private postService: PostService,
    public authenticationService: AuthenticationService
  ) {

  }

  ngOnInit(): void {
  }

  show() {
    this.postService.openCreatePost({
      groupName: this.groupResponse?.name || '',
      groupId: this.groupResponse?.id || NaN,
      groupPrivacy: this.groupResponse?.isPrivate ? 'GROUP' : 'PUBLIC'
    });
  }
}
