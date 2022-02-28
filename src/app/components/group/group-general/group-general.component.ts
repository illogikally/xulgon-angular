import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from '../../share/message.service';
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
    private title$: Title,
    private location: Location,
    private userService: UserService,
    private titleService: TitleService,
    private messageService: MessageService) {

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
    event.preventDefault();
    this.location.go(`/groups/${group.id}`);
    this.messageService.groupLoaded.next(group);
    this.messageService.loadPostsByPageId(group.id);
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
