import {Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ReplaySubject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {AuthenticationService} from '../core/authentication/authentication.service';
import {ErrorPageService} from '../error-page/error-page.service';
import {ConfirmDialogService} from '../logged-in/confirm-dialog/confirm-dialog.service';
import {FollowService} from '../shared/services/follow.service';
import {MessageService} from '../shared/services/message.service';
import {SirvPipe} from '../shared/pipes/sirv.pipe';
import {TitleService} from '../shared/services/title.service';
import {ToasterService} from '../shared/components/toaster/toaster.service';
import {UserService} from '../shared/services/user.service';
import {PageHeader} from './page-header';
import {ProfileService} from './profile.service';
import {UserPage} from './user-profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  private destroyed$ = new ReplaySubject<boolean>(1);
  profileLoaded = new EventEmitter<UserPage>();
  isUpdateAvatar = false;
  pageNotFound = false;
  isFriendOptsVisible = false;
  moreActionOptsVisible = false;
  pageHeader!: PageHeader;
  userProfile!: UserPage;
  principalId = this.authenticationService.getPrincipalId();
  principalProfileId = this.authenticationService.getProfileId();
  pageAvatarUrl!: string;

  tabs = [
    { name: 'Bài viết', path: '' },
    { name: 'Giới thiệu', path: 'about' },
    { name: 'Bạn bè', path: 'friends' },
    { name: 'Ảnh', path: 'photos' },
    { name: 'Video', path: 'videos', disabled: true },
    { name: 'Thể thao', path: 'sports', disabled: true },
    { name: 'Âm nhạc', path: 'music', disabled: true },
    { name: 'Sách', path: 'books', disabled: true },
    { name: 'Thích', path: 'likes', disabled: true },
    { name: 'Sự kiện', path: 'events', disabled: true },
  ]

  constructor(
    private followService: FollowService,
    private toaster: ToasterService,
    private confirmService: ConfirmDialogService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private userService: UserService,
    private profileService: ProfileService,
    private authenticationService: AuthenticationService,
    private titleService: TitleService,
    private messageService: MessageService,
    private errorPageService: ErrorPageService
  ) {
  }

  ngOnInit(): void {
    this.getPageHeaderFromRouteData();
    this.configureOnAvatarChange();
    this.configureOnCoverPhotoChange();
  }

  getPageHeaderFromRouteData() {
    const header = this.route.snapshot.data.header;
    if (!header || header.isBlocked) {
      this.errorPageService.showErrorPage();
      return;
    }

    this.pageHeader = header;

    this.pageAvatarUrl = new SirvPipe().transform(header.avatar?.url, 200);
    this.profileService.nextCurrentProfile(this.pageHeader);
    this.titleService.setTitle(this.pageHeader.name);
  }

  configureOnAvatarChange() {
    this.messageService.updateAvatar.pipe(
      filter(data => data.pageId == this.pageHeader.id),
    ).subscribe(data => {
      this.pageHeader.avatar = data.photo;
    });
  }

  configureOnCoverPhotoChange() {
    this.messageService.updateCoverPhoto.pipe(
      filter(data => data.pageId == this.pageHeader.id),
    ).subscribe(data => {
      this.pageHeader.coverPhoto = data.photo;
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.renderer.setStyle(document.body, 'position', '');
  }

  onAttach() {
    this.titleService.setTitle(this.pageHeader.name);
    this.profileService.onAttach$.next(this.pageHeader.id);
  }

  onDetach() {
    if (this.pageHeader) {
      this.profileService.onDetach$.next(this.pageHeader.id);
    }
  }

  updateHeaderPicture(type: 'COVER' | 'AVATAR'): void {
    this.isUpdateAvatar = true;
    this.messageService.updateAvatarOrCover.next({
      type: type,
      pageSourceId: this.pageHeader.id,
      pageToUpdateId: this.pageHeader.id
    });
  }

  openChatBox(): void {
    this.messageService.openChatBox$.next({
      id: this.pageHeader.userId,
      username: this.pageHeader.name,
      profileId: this.pageHeader.id,
      avatarUrl: new SirvPipe().transform(this.pageHeader.avatar?.url, 200)
    });
  }

  async  block() {
    const isConfirmed = await this.confirmService.confirm({
      title: 'Chặn người dùng',
      body: `Bạn có chắc muốn chặn ${this.pageHeader.name}?`
    });

    if (isConfirmed) {
      this.userService.block(this.pageHeader.userId).subscribe(() => {
        this.pageHeader.blocked = true;
        window.location.reload();
      });
    }
  }

  unblock() {
    this.userService.unblock(this.pageHeader.userId).subscribe(() => {
      this.pageHeader.blocked = false;
    });
  }

  follow() {
    this.followService.followPage(this.pageHeader.id).subscribe(() => {
      this.pageHeader.isFollow = true;
    })
  }

  unfollow() {
    this.followService.unfollowPage(this.pageHeader.id).subscribe(() => {
      this.pageHeader.isFollow = false;
    })
  }
}
