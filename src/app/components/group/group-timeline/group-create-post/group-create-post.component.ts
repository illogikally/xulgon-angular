import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/components/authentication/authentication.service';
import { GroupResponse } from '../../group-response';

@Component({
  selector: 'app-group-create-post',
  templateUrl: './group-create-post.component.html',
  styleUrls: ['./group-create-post.component.scss']
})
export class GroupCreatePostComponent implements OnInit {

  open$ = new Subject<any>();
  @Input() groupResponse!: GroupResponse;
  @Input() isGroup = true;

  constructor(
    public authenticationService: AuthenticationService
  ) {

  }

  ngOnInit(): void {
  }

  show() {
    this.open$.next();
  }
}
