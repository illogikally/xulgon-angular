import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

  private destroyed$ = new ReplaySubject<boolean>(1);

  tabs = [
    {name: 'Thảo luận', path: '', distance: NaN, element: undefined},
    {name: 'Giới thiệu', path: 'about', distance: NaN, element: undefined},
    {name: 'Thành viên', path: 'members', distance: NaN, element: undefined},
    {name: 'Ảnh', path: 'media', distance: NaN, element: undefined},
  ]

  @ViewChild('groupTimeline') groupTimeline!: ElementRef;
  constructor(
    private ngZone: NgZone,
    private groupService: GroupService,
    private message$: MessageService,
  ) {
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {

    this.message$.groupLoaded
      .pipe(takeUntil(this.destroyed$))
      .subscribe(groupResponse => {
        if (!groupResponse) return;
        this.group = groupResponse;
      });
  }

  ngAfterViewInit(): void {
    
  }

  onAttach() {
    this.groupService.attach$.next(this.group.id);
  }

  onDetach() {
    this.groupService.detach$.next(this.group.id);
  }

  sendJoinRequest() {
    this.groupService.sendJoinRequest(this.group.id).subscribe();
  }

  cancelJoinRequest(): void {
    this.groupService.cancelJoinRequest(this.group.id).subscribe();
  }

  toggleMoreActions() {
    this.isMoreActionsVisible = !this.isMoreActionsVisible;
  }

  leaveGroup(): void {
    this.groupService.leaveGroup(this.group.id).subscribe(_ => {
      window.location.reload();
    });
  }

}
