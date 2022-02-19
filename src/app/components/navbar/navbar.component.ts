import {Location} from '@angular/common';
import {Component, ElementRef, HostListener, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import { fromEvent, Subject } from 'rxjs';
import {AuthenticationService} from '../authentication/authentication.service';
import {MessageService} from '../share/message.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {


  @ViewChild('searchInput') searchBar!: ElementRef;

  openCreatePost = new Subject<any>();
  searchForm: FormGroup;
  principalName = this.authenticationService.getFirstName();
  principalId = this.authenticationService.getPrincipalId();
  principalAvatar = this.authenticationService.getAvatarUrl();
  principalProfileId = this.authenticationService.getProfileId();
  chatNotifVisible = false;
  moreOptsVisible = false;

  constructor(
    private messageService: MessageService,
    private location: Location,
    private router: Router,
    private renderer: Renderer2,
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

  showSearchBar() {
    if (window.innerWidth < 1250) {
      this.renderer.setStyle(this.searchBar.nativeElement, 'visibility', 'visible');
    }
    this.searchBar.nativeElement.focus();
  }

  hideSearchBar() {
    if (window.innerWidth < 1250) {
      this.renderer.removeStyle(this.searchBar.nativeElement, 'visibility');
    }
  }


  logout(): void {
    this.authenticationService.logout();
  }

  showCreatePost() {
    this.openCreatePost.next('');
  }

  search(event: any): void {
    if (!event.target.value) return;
    this.router.navigateByUrl('/search/people?q=' + event.target.value);
  }
}
