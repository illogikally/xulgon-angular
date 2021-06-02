import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  searchForm: FormGroup;
  isCreatePostVisible: boolean = false;
  loggedInUsername!: string;
  loggedInUserId!: number;
  loggedInUserAvatarUrl!: string;

  constructor(private auth: AuthenticationService) { 
    this.loggedInUsername = auth.getUserName();
    this.loggedInUserId = auth.getUserId();
    this.loggedInUserAvatarUrl = auth.getAvatarUrl();
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  ngOnInit(): void {
  }

  openCreatePost(): void {
    this.isCreatePostVisible = true;
  }

  closeCreatePost(): void {
    this.isCreatePostVisible = false;
  }
}
