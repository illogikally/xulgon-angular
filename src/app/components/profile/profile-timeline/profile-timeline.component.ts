import {Location} from '@angular/common';
import {AfterViewInit, Component, ElementRef, Host, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {from, fromEvent, Observable, ReplaySubject, Subject} from 'rxjs';
import { filter, last, skip, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MessageService} from '../../share/message.service';
import {Post} from '../../post/post';
import {PostService} from '../../post/post.service';
import {ProfileService} from '../profile.service';
import {UserProfile} from '../user-profile';

@Component({
  selector: 'app-profile-timeline',
  templateUrl: './profile-timeline.component.html',
  styleUrls: ['./profile-timeline.component.scss']
})
export class ProfileTimelineComponent implements OnInit, AfterViewInit {

  @Input() userProfile!: UserProfile;

  @ViewChild('sidebar', {static: true}) sidebar!: ElementRef;
  @ViewChild('sidebar__inner', {static: true}) sidebarInner!: ElementRef;

  principleId: number;
  pageId     : number;

  timeline: Post[] = [];
  isLoadingPosts = false;
  initialHide    = true;
  isLoadedAll    = false;

  onDetach$ = this.profileService.onDetach$.pipe(
    filter(id => id == this.pageId)
  );

  onAttached$ = this.profileService.onAttach$.pipe(
    filter(id => id == this.pageId)
  );

  constructor(
    private renderer: Renderer2,
    private profileService: ProfileService,
    private title   : Title,
    private messageService: MessageService,
    private location: Location,
    private router  : Router,
    private route   : ActivatedRoute,
    private post$   : PostService,
    private profile$: ProfileService,
    private auth$   : AuthenticationService
  ) {
    this.principleId = this.auth$.getAuthentication()!.userId as number;
    const id = this.route.parent?.snapshot.paramMap.get('id');
    this.pageId = Number(id);

  }

  onDetach() {
    this.profileService.onDetach$.next(this.pageId);
  }

  onAttach() {
    this.profileService.onAttach$.next(this.pageId);
  }

  ngOnInit(): void {

    // this.configureStickySidebar();
    this.setupLoadPostOnScroll();

    this.initialHide = false;

    if (!isNaN(this.pageId)) {
      this.getPosts();
      this.profile$.getUserProfile(this.pageId)
        .subscribe(profile => {
          this.userProfile = profile;
        })
    }
  }
  
  ngAfterViewInit(): void {
    this.profileService.onAttach$.next(this.pageId);
  }


  getPosts(): void {
    this.isLoadingPosts = true;
    const size = this.timeline.length ? 5 : 2;
    const offset = this.timeline.length;

    if (this.pageId !== NaN) {
      this.post$
        .getPostsByPageId(this.pageId, size, offset)
        .subscribe(response => {
          const posts = response.data;
          this.timeline = this.timeline.concat(posts);
          this.isLoadingPosts = false;
          if (!response.hasNext) {
            this.isLoadedAll = true;
          }
        });
    }
  }

  setupLoadPostOnScroll() {

    this.onAttached$.pipe(
      switchMap(() => fromEvent(window, 'scroll')
        .pipe(takeUntil(this.onDetach$))
      )
    ).subscribe(() => {
      if (
        window.scrollY >= document.body.scrollHeight - 1.2*window.innerHeight
        && !this.isLoadingPosts
        && !this.isLoadedAll
      ) {
        this.getPosts();
      }
    })
  }
}
