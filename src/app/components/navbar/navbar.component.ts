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

  sendMsg(event: any): void {
    console.log('send');
    
    this.rxStompService.publish({destination: '/app/chat', body: JSON.stringify({'msg': event.target.value})});
  }

  xulgon(): void {
    this.rxStompService.watch('/user/queue/chat').subscribe(msg => {
      console.log(msg);
    });
  }

  ngOnInit(): void {
    
    this.xulgon();
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
