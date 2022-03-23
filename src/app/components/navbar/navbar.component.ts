import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { PostService } from '../post/post.service';
import { MessageService } from '../share/message.service';
import { PrincipalService } from '../share/principal.service';
import { SirvPipe } from '../share/sirv.pipe';
import { TitleService } from '../share/title.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {


  @ViewChild('searchInput') searchBar!: ElementRef;

  openCreatePost = new Subject<any>();
  principalName = this.authenticationService.getFirstName();
  principalId = this.authenticationService.getPrincipalId();
  principalAvatarUrl = '';
  principalProfileId = this.authenticationService.getProfileId();
  principalFullName = this.authenticationService.getUserFullName();
  chatNotifVisible = false;
  moreOptsVisible = false;

  searchForm = new FormGroup({
    search: new FormControl('')
  }); 
  constructor(
    private messageService: MessageService,
    private router: Router,
    private postService: PostService,
    private renderer: Renderer2,
    private titleService: TitleService,
    private principalService: PrincipalService,
    private authenticationService: AuthenticationService
  ) {
    this.principalService.getAvatarUrl().then(url => this.principalAvatarUrl = url);
  }

  async ngOnInit() {
    this.configureOnAvatarUpdated();
    this.titleService.setTitle('Xulgon');
  }

  onAttach() {
    this.titleService.setTitle('Xulgon');
  }

  configureOnAvatarUpdated() {
    this.messageService.updateAvatar.pipe(
      pluck('photo')
    ).subscribe(photo => {
      this.principalAvatarUrl = photo.url;
    });
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
