import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication/authentication.service';
import {MessageService} from '../share/message.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  searchForm: FormGroup;
  isCreatePostVisible: boolean = false;
  principalName = this.authenticationService.getFirstName();
  principalId = this.authenticationService.getPrincipalId();
  principalAvatar = this.authenticationService.getAvatarUrl();
  principalProfileId = this.authenticationService.getPrincipalId();
  chatNotifVisible = false;
  moreOptsVisible = false;

  constructor(
    private messageService: MessageService,
    private location: Location,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.messageService.updateAvatar.subscribe(url => {
      this.principalAvatar = url;
      this.authenticationService.setAvatarUrl(url);
    });
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authenticationService.logout();
  }

  openCreatePost(): void {
    this.isCreatePostVisible = true;
  }

  closeCreatePost(): void {
    this.isCreatePostVisible = false;
  }

  search(event: any): void {
    if (!event.target.value) return;
    this.router.navigateByUrl('/search/people?q=' + event.target.value);
    // if (window.location.href.includes("http://localhost:4200/search/")) {
    //   window.location.reload();
    // }
  }
}
