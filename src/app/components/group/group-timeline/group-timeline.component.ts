import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Post } from '../../post/post';
import { PostService } from '../../post/post.service';
import { GroupResponse } from '../group-response';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-timeline',
  templateUrl: './group-timeline.component.html',
  styleUrls: ['./group-timeline.component.scss']
})
export class GroupTimelineComponent implements OnInit {

  @Input() groupResponse!: GroupResponse;
  posts: Post[] | undefined;

  constructor(private group$: GroupService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.groupResponse);
    
    this.group$.getTimeline(this.route.snapshot.paramMap.get('id') as unknown as number).subscribe(posts => {
      this.posts = posts;
    });
  }

}
