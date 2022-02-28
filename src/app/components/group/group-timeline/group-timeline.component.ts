import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Post } from '../../post/post';
import { GroupResponse } from '../group-response';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-timeline',
  templateUrl: './group-timeline.component.html',
  styleUrls: ['./group-timeline.component.scss']
})
export class GroupTimelineComponent implements OnInit {

  @Input() groupResponse!: GroupResponse;
  posts: Post[] = [];
  isPostView = false;
  groupId!: number;

  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'))
    this.isPostView = this.route.snapshot.data['isPostView'];
    if (this.isPostView) {
      this.groupId = Number(this.route.snapshot.parent?.parent?.paramMap.get('id'));
    }
    if (!this.isPostView) {
      this.groupService
        .getTimeline(this.groupId)
        .subscribe(response => {
          this.posts = response.data;
        });
    }

    this.configureOnGroupResponse();
  }

  configureOnGroupResponse() {
    this.groupService.groupResponse$.pipe(
      take(1)
    ).subscribe(response => {
      console.log(response);
      this.groupResponse = response;
    });
  }

}
