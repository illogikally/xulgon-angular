import { Component, EventEmitter, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { MessageService } from '../share/message.service';
import { TitleService } from '../share/title.service';
import { UserService } from '../share/user.service';
import { PageHeader } from './page-header';
import { ProfileService } from './profile.service';
import { UserPage } from './user-profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  private destroyed$ = new ReplaySubject<boolean>(1);
  profileLoaded = new EventEmitter<UserPage>();
  isUpdateAvatar = false;
  principalId: number;
  pageNotFound = false;
  isFriendOptsVisible = false;
  moreActionOptsVisible = false;
  isBlocked = false;
  pageHeader!: PageHeader;
  userProfile!: UserPage;

  pageAvatarUrl!: string;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private userService: UserService,
    private profileService: ProfileService,
    private authenticationService: AuthenticationService,
    private title: Title,
    private titleService: TitleService,
    private messageService: MessageService
  ) {
    this.principalId = authenticationService.getPrincipalId();
  }

  ngOnInit(): void {
    const header = this.route.snapshot.data.header;
    if (!header) {
      this.pageError();
      return;
    }

    this.pageHeader = header;
    this.pageAvatarUrl = header.avatar?.thumbnails.s200x200.url;

    this.titleService.setTitle(this.pageHeader.name);

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.isUserBlocked(id);
      this.loadProfile(id);
    } else {
      this.pageError();
    }

    this.configureOnAvatarChange();
    this.configureOnCoverPhotoChange();

  }

  configureOnAvatarChange() {
    this.messageService.updateAvatar.subscribe(photo => {
      this.pageHeader.avatar = photo;
    });
  }

  configureOnCoverPhotoChange() {
    this.messageService.updateCoverPhoto.subscribe(photo => {
      this.pageHeader.coverPhotoUrl = photo.thumbnails.s900x900.url;
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.renderer.setStyle(document.body, 'position', '');
  }

  onAttach(): void {
    this.titleService.setTitle(this.pageHeader.name);
    this.profileService.onAttach$.next(this.pageHeader.id);
  }

  onDetach() {
    if (this.pageHeader) {
      this.profileService.onDetach$.next(this.pageHeader.id);
    }
  }

  loadProfile(id: number): void {
    if (isNaN(id)) return;

    this.profileService.getUserProfile(id)
      .subscribe(resp => {
        this.pageNotFound = false;
        if (resp.isBlocked) this.pageError();
        this.title.setTitle(resp.fullName);

        this.userProfile = resp;
        this.messageService.sendLoadedProfile(this.userProfile);
        this.profileLoaded.emit(this.userProfile);
        this.profileLoaded.emit({} as UserPage);
      }, () => {
        this.pageError();
      });
    this.messageService.loadPostsByPageId(id);
  }

  pageError() {
    this.pageNotFound = true;
  }

  showUpdateProfilePic(type: string): void {
    this.isUpdateAvatar = true;
    this.messageService.updateAvatarOrCover.next(type);
  }

  isUserBlocked(profileId: number): void {
    this.profileService.isBlocked(profileId).subscribe(isBlocked => {
      if (isBlocked) this.pageError();
      this.pageNotFound = isBlocked;
      this.isBlocked = isBlocked;
    })
  }

  openChatBox(): void {
    this.messageService.openChatBox$.next({
      id: this.pageHeader.userId,
      username: this.pageHeader.name,
      profileId: this.pageHeader.id,
      avatarUrl: this.pageHeader?.avatar?.thumbnails.s40x40
    });
  }

  block(): void {
    this.userService.block(this.pageHeader.userId).subscribe(() => {
      this.isBlocked = true;
    });
  }

  unblock(): void {
    this.userService.unblock(this.pageHeader.userId).subscribe(() => {
      this.isBlocked = false;
    });
  }

}
