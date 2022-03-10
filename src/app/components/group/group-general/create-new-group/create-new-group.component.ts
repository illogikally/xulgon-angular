import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupService } from '../../group.service';

@Component({
  selector: 'app-create-new-group',
  templateUrl: './create-new-group.component.html',
  styleUrls: ['./create-new-group.component.scss']
})
export class CreateNewGroupComponent implements OnInit {

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

  submit(): void {
    if (!this.submitable()) return;
    let createGroupRequest = {
      isPrivate: this.privacy,
      name: this.createGroupForm.get('groupName')?.value
    }

    this.groupService.createGroup(createGroupRequest).subscribe(groupId => {
      this.router.navigateByUrl(`/groups/${groupId}`);
    });
  }

  submitable(): boolean {
    return !!this.createGroupForm.get('groupName')?.value
      && this.privacy !== undefined;
  }
}
