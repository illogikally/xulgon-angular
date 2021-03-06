import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {filter, take} from 'rxjs/operators';
import {AuthenticationService} from '../../core/authentication/authentication.service';
import {FollowService} from '../../shared/services/follow.service';
import {MessageService} from '../../shared/services/message.service';
import {GroupResponse} from '../group-response';
import {GroupService} from '../group.service';

@Component({
  selector: 'app-group-content',
  templateUrl: './group-content.component.html',
  styleUrls: ['./group-content.component.scss']
})
export class GroupContentComponent implements OnInit, OnDestroy, AfterViewInit {

  group!: GroupResponse;
  loadedTabs = new Set<string>();
  currentTab = '';
  isMoreActionsVisible = false;
  defaultCoverPhotoUrl = this.groupService.getDefaultCoverPhotoUrl();
  isSendingJoinRequest = false;

  private destroyed$ = new ReplaySubject<boolean>(1);

  tabs = [
    {name: 'Thảo luận', path: ''},
    {name: 'Thành viên', path: 'members'},
    {name: 'Ảnh', path: 'media'},
  ]

  @ViewChild('groupTimeline') groupTimeline!: ElementRef;
  constructor(
    private groupService: GroupService,
    private followService: FollowService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.getGroupResponseFromParent();
    this.configureDisableTabsIfNotMemberOrPrivate();
  }

  ngAfterViewInit(): void {
  }

  configureDisableTabsIfNotMemberOrPrivate() {
    let disable = !(this.group.isMember || !this.group.isPrivate);
    if (disable) {
      this.tabs = this.tabs.filter(tab => !['members', 'media'].includes(tab.path));
    }
  }

  getGroupResponseFromParent() {
    this.groupService.currentGroup().pipe(
      take(1),
      filter(group => !!group)
    ).subscribe(group =>  this.group = group);
  }

  onAttach() {
  }

  onDetach() {
    this.groupService.detach$.next(this.group.id);
  }

  sendJoinRequest() {
    this.isSendingJoinRequest = true;
    this.groupService.sendJoinRequest(this.group.id).subscribe(() => {
      this.group.isRequestSent = true;
      this.isSendingJoinRequest = false;
    });
  }

  cancelJoinRequest(): void {
    this.isSendingJoinRequest = true;
    this.groupService.cancelJoinRequest(this.group.id).subscribe(() => {
      this.group.isRequestSent = false;
      this.isSendingJoinRequest = false;
    });
  }

  leaveGroup(): void {
    this.groupService.leaveGroup(this.group.id).subscribe(() => {
      window.location.reload();
    });
  }

  follow() {
    this.followService.followPage(this.group.id).subscribe(() => {
      this.group.isFollow = true;
    });
  }

  unfollow() {
    this.followService.unfollowPage(this.group.id).subscribe(() => {
      this.group.isFollow = false;
    });
  }

  updateCover(source: 'GROUP' | 'PROFILE') {
    const principalProfileId = this.authenticationService.getPrincipalId();
    this.messageService.updateAvatarOrCover.next({
      type: 'COVER',
      pageSourceId: source == 'GROUP' ? this.group.id : principalProfileId,
      pageToUpdateId: this.group.id
    });
    this.messageService.updateCoverPhoto.pipe(
      filter(data => data.pageId == this.group.id),
      take(1),
    ).subscribe(data => {
      this.group.coverPhotoUrl = data.photo.url;
    });
  }

}
