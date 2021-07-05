import { group } from '@angular/animations';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from '../../common/message.service';
import { UserService } from '../../common/user.service';
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

  constructor(private http: HttpClient,
    private router: Router,
    private group$: GroupService,
    private title$: Title,
    private location: Location,
    private user$: UserService,
    private message$: MessageService) { 

    this.createGroupForm = new FormGroup({
      groupName: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.title$.setTitle('Groups');
    this.user$.getJoinedGroups().subscribe(groups => {
      this.managedGroups = groups.filter(group => group.role == 'ADMIN');
      this.groups = groups.filter(group => group.role == 'MEMBER');
    });
  }

  changeGroup(event: any, group: GroupResponse): void {
    event.preventDefault();
    this.location.go(`/groups/${group.id}`);
    this.message$.groupLoaded.next(group);
    this.message$.loadPostsByPageId(group.id);
  }

  abort(): void {
    this.createGroupVisible = false;
    this.createGroupIsPrivate = undefined;
  }

  submit(): void {
    if (!this.submitable()) return;
    let createGroupRequest = {
      isPrivate: this.createGroupIsPrivate,
      name: this.createGroupForm.get('groupName')?.value
    }

    this.group$.createGroup(createGroupRequest).subscribe(groupId => {
      this.router.navigateByUrl(`/groups/${groupId}`);
    });
  }

  submitable(): boolean {
    return !!this.createGroupForm.get('groupName')?.value 
    && this.createGroupIsPrivate !== undefined;
  }
}
