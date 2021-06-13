import { Component, Input, OnInit } from '@angular/core';
import { GroupResponse } from '../group-response';

@Component({
  selector: 'app-group-timeline',
  templateUrl: './group-timeline.component.html',
  styleUrls: ['./group-timeline.component.scss']
})
export class GroupTimelineComponent implements OnInit {

  @Input() groupResponse!: GroupResponse;

  constructor() { }

  ngOnInit(): void {
  }

}
