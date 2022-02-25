import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProfileService} from './profile.service';
import {UserProfile} from './user-profile';
import {MessageService} from '../share/message.service';
import {UserService} from '../share/user.service';
import {AuthenticationService} from '../authentication/authentication.service';
import {Location} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {switchMap, takeUntil} from 'rxjs/operators';
import {fromEvent, ReplaySubject, Subject} from 'rxjs';
import {Post} from '../post/post';
import {PostService} from '../post/post.service';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { PageHeader } from './page-header';
import { TitleService } from '../share/title.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  private destroyed$ = new ReplaySubject<boolean>(1);
  profileLoaded = new EventEmitter<UserProfile>();
  isUpdateAvatar = false;
  principalId: number;
  pageNotFound = false;
  isFriendOptsVisible = false;
  moreActionOptsVisible = false;
  isBlocked = false;
  pageHeader!: PageHeader;
  userProfile!: UserProfile;

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
    this.pageAvatarUrl = header.avatar?.thumbnails.s160x160.url;

    this.messageService.updateCoverPhoto
      .pipe(takeUntil(this.destroyed$))
      .subscribe(url => {
        this.pageHeader.coverPhotoUrl = url;
      });

    this.titleService.setTitle(this.pageHeader.name);
    this.messageService.updateAvatar
      .pipe(takeUntil(this.destroyed$))
      .subscribe(url => {
        this.pageAvatarUrl = url;
      });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.isUserBlocked(id);
      this.loadProfile(id);
    } else {
      this.pageError();
    }

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
        this.profileLoaded.emit({} as UserProfile);
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
      avatarUrl: this.pageHeader.avatar.thumbnails.s40x40
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
