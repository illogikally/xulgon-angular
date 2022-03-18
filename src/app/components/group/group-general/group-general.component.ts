import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TitleService } from '../../share/title.service';
import { UserService } from '../../share/user.service';
import { GroupResponse } from '../group-response';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-general',
  templateUrl: './group-general.component.html',
  styleUrls: ['./group-general.component.scss']
})
export class GroupGeneralComponent implements OnInit {


  managedGroups!: GroupResponse[];
  groups!: GroupResponse[];

  selectedGroup = new Subject<number>();
  constructor(
    public groupService: GroupService,
    private userService: UserService,
    public route: ActivatedRoute,
    private titleService: TitleService,
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Groups');
    this.userService.getJoinedGroups().subscribe(groups => {
      this.managedGroups = groups.filter(group => group.role == 'ADMIN');
      this.groups = groups.filter(group => group.role == 'MEMBER');
    });
  }

  onAttach() {
    this.titleService.setTitle('Groups');
  }

  onDetach() {
    this.selectedGroup.next(-1);
  }
}
