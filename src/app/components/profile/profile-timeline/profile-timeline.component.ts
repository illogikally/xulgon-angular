import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Post } from '../../post/post';
import { PostService } from '../../post/post.service';
import { PhotoService } from '../../share/photo/photo.service';
import { ProfileService } from '../profile.service';
import { UserPage } from '../user-profile';

@Component({
  selector: 'app-profile-timeline',
  templateUrl: './profile-timeline.component.html',
  styleUrls: ['./profile-timeline.component.scss']
})
export class ProfileTimelineComponent implements OnInit, AfterViewInit {

  @Input() userPage!: UserPage;

  @ViewChild('postsContainer') postsContainer!: ElementRef;

  principleId: number;
  pageId     : number;

  timeline: Post[] = [];
  isLoadingPosts   = false;
  isLoadedAll      = false;
  pagePhotoSetId!: number;

  isComponentAttached = true;
  isComponentDetached = false;

  onDetach$ = this.profileService.onDetach$.pipe(
    filter(id => id == this.pageId)
  );

  onAttach$ = this.profileService.onAttach$.pipe(
    filter(id => id == this.pageId)
  );

  constructor(
    private profileService: ProfileService,
    private route   : ActivatedRoute,
    private post$   : PostService,
    private profile$: ProfileService,
    private auth$   : AuthenticationService,
    private photoService: PhotoService
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
    if (!isNaN(this.pageId)) {
      this.getPosts();
      this.profile$.getUserProfile(this.pageId)
        .subscribe(profile => {
          this.userPage = profile;
          this.photoService.getPagePhotoSetId(this.userPage.id).subscribe(id => {
            this.pagePhotoSetId = id;
          });
        })
    }
  }
  
  ngAfterViewInit(): void {
    this.configureLoadPostOnScroll();
    this.profileService.onAttach$.next(this.pageId);
  }

  getPosts(): void {
    this.isLoadingPosts = true;
    const size = this.timeline.length ? 5 : 2;
    const offset = this.timeline.length;

    if (this.pageId !== NaN) {
      this.post$.getPostsByPageId(this.pageId, size, offset)
        .subscribe(response => {
          this.timeline = this.timeline.concat(response.data);
          this.isLoadingPosts = false;
          if (!response.hasNext) {
            this.isLoadedAll = true;
          }
        });
    }
  }

  configureLoadPostOnScroll() {
    this.onAttach$.pipe(
      switchMap(() => fromEvent(window, 'scroll')
        .pipe(takeUntil(this.onDetach$))
      )
    ).subscribe(() => {
      const postContainerRect = 
        this.postsContainer.nativeElement.getBoundingClientRect();
      if (
        window.scrollY >= postContainerRect.bottom - 1.2*window.innerHeight
        && !this.isLoadingPosts
        && !this.isLoadedAll
      ) {
        this.getPosts();
      }
    })
  }
}
