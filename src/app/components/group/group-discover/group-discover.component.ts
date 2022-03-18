import { Component, OnInit } from '@angular/core';
import { GroupResponse } from '../group-response';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-discover',
  templateUrl: './group-discover.component.html',
  styleUrls: ['./group-discover.component.scss']
})
export class GroupDiscoverComponent implements OnInit {

  groups: GroupResponse[] = [];
  hasNext = true;

  constructor(
    private groupService: GroupService
  ) { }

  ngOnInit(): void {
    this.getGroups();
  }

  getGroups() {
    const size = 5;
    const offset = this.groups.length;
    this.groupService.getGroups(size, offset).subscribe(response => {
      const groups = response.data.filter(group => !group.isMember);
      this.groups = this.groups.concat(groups);
      this.hasNext = response.hasNext;
    })
  }
}
