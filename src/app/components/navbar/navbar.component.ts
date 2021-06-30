import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RxStompService } from '@stomp/ng2-stompjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { MessageService } from '../common/message.service';

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
  chatNotifVisible = false;
  moreOptsVisible = false;
  loggedInUserProfileId!: any;

  constructor(private messageService: MessageService,
    private router: Router,
    private auth: AuthenticationService) { 
    this.loggedInUsername = this.auth.getUserName();
    this.loggedInUserId = this.auth.getUserId();
    this.loggedInUserAvatarUrl = this.auth.getAvatarUrl();
    this.loggedInUserProfileId = this.auth.getProfileId();
    this.messageService.updateAvatar.subscribe(url => {
      this.loggedInUserAvatarUrl = url;
      this.auth.setAvatarUrl(url);
    });
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  openCreatePost(): void {
    this.isCreatePostVisible = true;
  }

  closeCreatePost(): void {
    this.isCreatePostVisible = false;
  }
}
