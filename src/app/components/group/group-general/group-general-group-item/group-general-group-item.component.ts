import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { GroupResponse } from '../../group-response';
import { GroupService } from '../../group.service';

@Component({
  selector: 'app-group-general-group-item',
  templateUrl: './group-general-group-item.component.html',
  styleUrls: ['./group-general-group-item.component.scss']
})
export class GroupGeneralGroupItemComponent implements OnInit {

  @Input() group!: GroupResponse;
  @Input() selectedGroup!: Subject<number>;
  selected = false;
  constructor(
    public groupService: GroupService,
    private location: Location,
    private router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.listenOnGroupSelected();
  }

  listenOnGroupSelected() {
    this.selectedGroup.subscribe(id => {
      this.selected = id == this.group.id;
    })
  }

  select(event: any) {
    if (this.group.role != 'ADMIN') {
      this.selectedGroup.next(this.group.id);
      this.location.go(`/groups/${this.group.id}`);
      this.router.navigate([this.group.id], {
        skipLocationChange: true, 
        relativeTo: this.route
      });
    }
    else {
      this.router.navigateByUrl('/groups/' + this.group.id);
    }
  }
}
