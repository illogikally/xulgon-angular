import { Location, LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from '../../common/message.service';
import { GroupResponse } from '../group-response';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-content',
  templateUrl: './group-content.component.html',
  styleUrls: ['./group-content.component.scss']
})
export class GroupContentComponent implements OnInit, OnDestroy{

  groupResponse!: GroupResponse;
  loadedTabs = new Set<string>();
  currentTab = '';
  isMoreActionsVisible = false;

  private destroyed$ = new ReplaySubject<boolean>(1);

  constructor(private location: Location,
    private group$: GroupService,
    private message$: MessageService,
    private renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient) { }

  ngOnDestroy() {
    // this.message$.groupLoaded.next(null);
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.initDefaultTab();

    this.message$.groupLoaded
    .pipe(takeUntil(this.destroyed$))
    .subscribe(groupResponse => {
      if (!groupResponse) return;
      console.log(groupResponse);
      

      this.groupResponse = groupResponse;
    });
  }

  initDefaultTab(): void {
    this.setDefaultTab('');
    this.setDefaultTab('about');
    this.setDefaultTab('media');
    this.setDefaultTab('members')
  }

  setDefaultTab(tab: string) {
    let url = window.location.href;
    if (new RegExp(tab).test(url)) {
      this.loadedTabs.add(tab);
      this.currentTab = tab;
    }
  }

  switchTab(event: any, tab: string): void {
    event.preventDefault();
    this.loadedTabs.add(tab);
    this.currentTab = tab;
    this.location.go(`groups/${this.groupResponse.id}/${tab}`);
  }

  sendJoinRequest(): void {
    this.http.post(`http://localhost:8080/api/groups/${this.groupResponse.id}/join-requests`, {})
        .subscribe(_ => {
          this.groupResponse.isRequestSent = true;
        });
  }

  cancelJoinRequest(): void {
    this.http.delete(`http://localhost:8080/api/groups/${this.groupResponse.id}/join-requests`)
        .subscribe(_ => {
          this.groupResponse.isRequestSent = false;
        });
  }

  toggleMoreActions() {
    this.isMoreActionsVisible = !this.isMoreActionsVisible;
  }

  leaveGroup(): void {
    this.group$.leaveGroup(this.groupResponse.id).subscribe(_ => {
      window.location.reload();
    });
  }

}
