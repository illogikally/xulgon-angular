import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { filter, map, pluck, take } from 'rxjs/operators';
import { AuthenticationService } from '../../authentication/authentication.service';
import { FollowService } from '../../share/follow.service';
import { MessageService } from '../../share/message.service';
import { GroupResponse } from '../group-response';
import { GroupService } from '../group.service';

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
    this.groupService.attach$.next(this.group.id);
  }

  onDetach() {
    this.groupService.detach$.next(this.group.id);
  }

  sendJoinRequest() {
    this.groupService.sendJoinRequest(this.group.id).subscribe(() => {
      this.group.isRequestSent = true;
    });
  }

  cancelJoinRequest(): void {
    this.groupService.cancelJoinRequest(this.group.id).subscribe(() => {
      this.group.isRequestSent = false;
    });
  }

  leaveGroup(): void {
    this.groupService.leaveGroup(this.group.id).subscribe(_ => {
      window.location.reload();
    });
  }

  follow() {
    this.followService.followPage(this.group.id).subscribe();
  }

  unfollow() {
    this.followService.followPage(this.group.id).subscribe();
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
      map(data => data.photo)
    ).subscribe(photo => {
      this.group.coverPhotoUrl = photo.url;
    });
  }

}
