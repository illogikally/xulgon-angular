import { Component, Input, OnInit } from '@angular/core';
import { GroupResponse } from '../../group-response';
import { GroupService } from '../../group.service';

@Component({
  selector: 'app-group-discover-item',
  templateUrl: './group-discover-item.component.html',
  styleUrls: ['./group-discover-item.component.scss']
})
export class GroupDiscoverItemComponent implements OnInit {

  @Input() group!: GroupResponse;
  defaultCoverUrl = this.groupService.getDefaultCoverUrl();

  constructor(
    private groupService: GroupService
  ) { }

  ngOnInit(): void {
  }

  sendJoinRequest() {
    if (this.group.isRequestSent) return;
    this.groupService.sendJoinRequest(this.group.id).subscribe(() => {
      this.group.isRequestSent = true;
    });
  }
}
