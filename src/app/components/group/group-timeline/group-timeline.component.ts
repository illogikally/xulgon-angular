import {Component, HostListener, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Post} from '../../post/post';
import {GroupResponse} from '../group-response';
import {GroupService} from '../group.service';

@Component({
  selector: 'app-group-timeline',
  templateUrl: './group-timeline.component.html',
  styleUrls: ['./group-timeline.component.scss']
})
export class GroupTimelineComponent implements OnInit {

  @Input() groupResponse!: GroupResponse;
  posts: Post[] = [];

  constructor(private group$: GroupService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    let profileId = Number(this.route.snapshot.paramMap.get('id'))
    this.group$
      .getTimeline(profileId)
      .subscribe(posts => {
        this.posts = posts;
      });
    console.log(this.route.url);
  }

}
