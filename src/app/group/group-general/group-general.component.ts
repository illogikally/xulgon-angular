import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {TitleService} from '../../shared/services/title.service';
import {UserService} from '../../shared/services/user.service';
import {GroupResponse} from '../group-response';
import {GroupService} from '../group.service';

@Component({
  selector: 'app-group-general',
  templateUrl: './group-general.component.html',
  styleUrls: ['./group-general.component.scss']
})
export class GroupGeneralComponent implements OnInit {


  managedGroups!: GroupResponse[];
  groups!: GroupResponse[];
  selectedGroup = new Subject<number>();
  isLoadingGroups = false;

  @ViewChild('sidebarBelow') sidebarBelow!: ElementRef;
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('toggleButton') toggleButton!: ElementRef;
  constructor(
    public groupService: GroupService,
    private userService: UserService,
    public route: ActivatedRoute,
    private titleService: TitleService,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Groups');
    this.getGroups();
    this.listenOnGroupJoinAccepted();
  }

  getGroups() {
    this.isLoadingGroups = true;
    this.userService.getJoinedGroups().subscribe(groups => {
      this.managedGroups = groups.filter(group => group.role == 'ADMIN');
      this.groups = groups.filter(group => group.role == 'MEMBER');
      this.isLoadingGroups = false;
    });
  }

  onAttach() {
    this.titleService.setTitle('Groups');
  }

  onDetach() {
    this.selectedGroup.next(-1);
  }

  listenOnGroupJoinAccepted() {
    this.groupService.groupMemberAccepted$.subscribe(groupId => {
      this.groupService.getGroupHeader(groupId).subscribe(group => {
        this.groups.push(group)
      });
    });
  }


  newGroupCreated(group: GroupResponse) {
    this.managedGroups.push(group);
  }
}
