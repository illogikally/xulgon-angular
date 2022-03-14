import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { PostService } from '../post/post.service';
import { MessageService } from '../share/message.service';
import { PrincipalService } from '../share/principal.service';

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
  principalAvatar = this.principalService.getAvatarUrl();
  principalProfileId = this.authenticationService.getProfileId();
  chatNotifVisible = false;
  moreOptsVisible = false;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private postService: PostService,
    private renderer: Renderer2,
    private principalService: PrincipalService,
    private authenticationService: AuthenticationService
  ) {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  configureOnAvatarUpdated() {
    this.messageService.updateAvatar.pipe(
      pluck('photo')
    ).subscribe(photo => {
      this.principalAvatar = photo.thumbnails.s40x40.url;
    });
  }

  ngOnInit(): void {
    this.configureOnAvatarUpdated();
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
    this.postService.openCreatePost(null);
  }

  search(event: any): void {
    if (!event.target.value) return;
    this.router.navigateByUrl('/search/people?q=' + event.target.value);
  }
}
