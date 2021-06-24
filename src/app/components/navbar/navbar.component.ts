import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  constructor(private messageService: MessageService,
    private rxStompService: RxStompService,
    private auth: AuthenticationService) { 

    this.loggedInUsername = auth.getUserName();
    this.loggedInUserId = auth.getUserId();
    this.loggedInUserAvatarUrl = auth.getAvatarUrl();
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.messageService.updateAvatar.subscribe(url => {
      this.loggedInUserAvatarUrl = url;
      this.auth.setAvatarUrl(url);
    });
  }

  openCreatePost(): void {
    this.isCreatePostVisible = true;
  }

  closeCreatePost(): void {
    this.isCreatePostVisible = false;
  }
}
