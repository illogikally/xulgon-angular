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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() profileId!: number;

  @ViewChild('sidebar', {static: true}) sidebarElement!: ElementRef;
  @ViewChild('replyFriendRequest') replyRequestBtn!: ElementRef;
  @ViewChild('friend') friendBtn!: ElementRef;
  @ViewChild('actionMenu', {static: true}) tabBarElement!: ElementRef;

  @ViewChild('buttons') buttonsElement!: ElementRef;
  @ViewChild('tabs') tabsElement!: ElementRef;
  @ViewChild('tabsWrapper') tabsWrapperElement!: ElementRef;
  @ViewChild('moreTabs') moreTabsElement!: ElementRef;

  private destroyed$ = new ReplaySubject<boolean>(1);

  profileLoaded = new EventEmitter<UserProfile>();
  isUpdateAvatar = false;
  principalId: number;
  pageNotFound = false;
  isFriendOptsVisible = false;
  moreActionOptsVisible = false;
  profileHeader: any;
  userProfile!: UserProfile;

  isTabBarSticky = false;
  isMoreTabsVisible = false;
  isTabBarConfigured = false;

  profileTabs = [
    {name: 'Bài viết', path: '', distance: NaN, element: undefined},
    {name: 'Giới thiệu', path: 'about', distance: NaN, element: undefined},
    {name: 'Bạn bè', path: 'friends', distance: NaN, element: undefined},
    {name: 'Ảnh', path: 'photos', distance: NaN, element: undefined},
    {name: 'Bài viết', path: '', distance: NaN, element: undefined},
    {name: 'Giới thiệu', path: 'about', distance: NaN, element: undefined},
    {name: 'Bạn bè', path: 'friends', distance: NaN, element: undefined},
    {name: 'Ảnh', path: 'photos', distance: NaN, element: undefined},
  ]
  visibleTabs = this.profileTabs;
  hiddenTabs: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private renderer: Renderer2,
    private userService: UserService,
    private profileService: ProfileService,
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthenticationService,
    private changeDetector: ChangeDetectorRef,
    private title: Title,
    private location: Location,
    private messageService: MessageService
  ) {
    this.principalId = authService.getProfileId();
  }

  ngOnInit(): void {
    this.profileHeader = this.route.snapshot.data.header;

    this.messageService.updateCoverPhoto
      .pipe(takeUntil(this.destroyed$))
      .subscribe(url => {
        this.profileHeader.coverPhotoUrl = url;
      });

    this.messageService.updateAvatar
      .pipe(takeUntil(this.destroyed$))
      .subscribe(url => {
        this.profileHeader.avatar.url = url;
      });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.isBlocked(id);
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
    this.title.setTitle(this.profileHeader.profileName);
    this.profileService.onAttach$.next(this.profileHeader.id);
  }

  onDetach() {
    if (this.profileHeader) {
      this.profileService.onDetach$.next(this.profileHeader.id);
    }
  }


  ngAfterViewInit(): void {
    this.onTabBarSticky();
    this.saveTabSizes();

    this.configureOnTabBarResize();
  }

  configureOnTabBarResize() {
    const wrapperElement = this.tabsWrapperElement.nativeElement;
    const moreTabsElementWidth = this.moreTabsElement.nativeElement.offsetWidth;
    const tabsButtonsMargin = 60;
    let isRunning = false;
    new ResizeObserver(() => {
      if (
        isRunning || 
        !this.tabsWrapperElement || 
        !this.tabsElement 
      ) return;
      isRunning = true;

      this.ngZone.run(() => {

        let [lastTab] = this.visibleTabs.slice(-1);
        while (
          lastTab && 
          wrapperElement.offsetWidth - tabsButtonsMargin 
            < lastTab.distance + moreTabsElementWidth
        ) {
          this.hiddenTabs.unshift(this.visibleTabs.pop());
          [lastTab] = this.visibleTabs.slice(-1);
        }

        if (
          this.hiddenTabs[0] &&
          wrapperElement.offsetWidth - tabsButtonsMargin 
            > this.hiddenTabs[0].distance + moreTabsElementWidth
        ) {
          this.visibleTabs.push(this.hiddenTabs.shift());
        }
        this.isTabBarConfigured = true;
      });
      isRunning = false;
    }).observe(this.tabsWrapperElement.nativeElement);
  }

  saveTabSizes() {
    const tabs = this.tabsElement.nativeElement.children;
    this.profileTabs[0].distance = tabs[0].offsetWidth;
    this.profileTabs[0].element = tabs[0];
    for (let i = 1; i < this.profileTabs.length; ++i) {
      this.profileTabs[i].distance = tabs[i].offsetWidth + this.profileTabs[i-1].distance;
      this.profileTabs[i].element = tabs[i];
    }
  }

  onTabBarSticky() {
    const menu: HTMLElement = this.tabBarElement.nativeElement;
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        this.isTabBarSticky = false;
      } else  {
        this.isTabBarSticky = true;
      }
    },
    {
      rootMargin: "-56px 0px 0px 0px",
      threshold: [1]
    });
    observer.observe(menu);
  }


  openChatBox(): void {
    this.messageService.openChatBox$.next({
      id: this.profileHeader.userId,
      username: this.profileHeader.profileName,
      profileId: this.profileHeader.id,
      avatarUrl: this.profileHeader.avatar.url
    });
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
      }, _ => {
        this.pageError();
      });
    this.messageService.loadPostsByPageId(id);
  }

  pageError(): void {
    this.pageNotFound = true;
    const profile = document.querySelector<HTMLElement>('.user-profile')!;
    this.renderer.setStyle(profile, 'display', 'none');
  }

  showUpdateProfilePic(type: string): void {
    this.isUpdateAvatar = true;
    this.messageService.updateAvatarOrCover.next(type);
  }

  block(): void {
    this.userService.block(this.userProfile.userId).subscribe(_ => {
      this.userProfile.blocked = true;
    });
  }

  unblock(): void {
    this.userService.unblock(this.userProfile.userId).subscribe(_ => {
      this.userProfile.blocked = false;
    });
  }

  isBlocked(profileId: number): void {
    this.profileService.isBlocked(profileId).subscribe(isBlocked => {
      // if (isBlocked) this.pageError();
      this.pageNotFound = isBlocked;
    })
  }

}
