import { Component, Input, OnInit } from '@angular/core';
import { GroupResponse } from '../../group-response';

@Component({
  selector: 'app-group-create-post',
  templateUrl: './group-create-post.component.html',
  styleUrls: ['./group-create-post.component.scss']
})
export class GroupCreatePostComponent implements OnInit {

  createPostVisible = false;
  @Input() groupResponse!: GroupResponse;

  constructor() { }

  ngOnInit(): void {
  }

}
