import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupResponse } from '../../group-response';
import { GroupService } from '../../group.service';

@Component({
  selector: 'app-create-new-group',
  templateUrl: './create-new-group.component.html',
  styleUrls: ['./create-new-group.component.scss']
})
export class CreateNewGroupComponent implements OnInit {

  @Output() created = new EventEmitter<GroupResponse>();
  createGroupVisible = false;
  createGroupForm = this.fb.group({
    groupName: ['']
  })
  privacy: undefined | boolean;
  privacySelectVisible = false;
  constructor(
    private groupService: GroupService,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  abort(): void {
    this.createGroupVisible = false;
    this.privacy = undefined;
    this.createGroupForm.get('groupName')?.setValue('');
  }

  submit() {
    if (!this.submitable()) return;
    let createGroupRequest = {
      isPrivate: this.privacy,
      name: this.createGroupForm.get('groupName')?.value
    }

    this.groupService.createGroup(createGroupRequest).subscribe(async groupId => {
      const group = await this.groupService.getGroupHeader(groupId).toPromise(); 
      this.created.emit(group);
      this.abort();
      this.router.navigateByUrl(`/groups/${groupId}`);
    });
  }

  submitable(): boolean {
    return !!this.createGroupForm.get('groupName')?.value
      && this.privacy !== undefined;
  }
}
