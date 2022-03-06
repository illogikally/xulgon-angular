import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  createGroupVisible = false;

  currentTab = 'feed';
  createGroupForm: FormGroup;

  createGroupIsPrivate: undefined | boolean;
  createGroupPrivacyDropVisible = false;

  constructor(
    private router: Router,
    private groupService: GroupService,
    private location: Location,
    private userService: UserService,
    private titleService: TitleService,
    private activatedRoute: ActivatedRoute
  ) {
    this.createGroupForm = new FormGroup({
      groupName: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Groups');
    this.userService.getJoinedGroups().subscribe(groups => {
      this.managedGroups = groups.filter(group => group.role == 'ADMIN');
      this.groups = groups.filter(group => group.role == 'MEMBER');
    });
  }

  changeGroup(event: any, group: GroupResponse): void {
    this.location.go(`/groups/${group.id}`);
    this.router.navigate([group.id], {
      skipLocationChange: true, 
      relativeTo: this.activatedRoute
    });
    event.preventDefault();
  }

  abort(): void {
    this.createGroupVisible = false;
    this.createGroupIsPrivate = undefined;
    this.createGroupForm.get('groupName')?.setValue('');
  }

  submit(): void {
    if (!this.submitable()) return;
    let createGroupRequest = {
      isPrivate: this.createGroupIsPrivate,
      name: this.createGroupForm.get('groupName')?.value
    }

    this.groupService.createGroup(createGroupRequest).subscribe(groupId => {
      this.router.navigateByUrl(`/groups/${groupId}`);
    });
  }

  submitable(): boolean {
    return !!this.createGroupForm.get('groupName')?.value
      && this.createGroupIsPrivate !== undefined;
  }
}
