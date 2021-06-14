import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../common/message.service';
import { GroupResponse } from './group-response';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  groupResponse!: GroupResponse;
  loadedTabs = new Set<string>();
  currentTab = '';
  isMoreActionsVisible = false;

  @ViewChild('moreAction') moreAction!: ElementRef;

  constructor(private location: Location,
    private messageService: MessageService,
    private renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.initDefaultTab();

    this.activatedRoute.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.getGroupProfile(id);
      }
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

  getGroupProfile(id: number): void {
    this.messageService.pageId.next(id);
    this.http.get<GroupResponse>(`http://localhost:8080/api/groups/${id}`).subscribe(profile => {
      this.groupResponse = profile;
      console.log(this.groupResponse);
    }, error => {
      console.log("Group Not found");
    });

  }

  sendJoinRequest(): void {
    this.http.post(`http://localhost:8080/api/groups/${this.groupResponse.id}/join-request`, {})
        .subscribe(_ => {
          this.groupResponse.isRequestSent = true;
        });
  }
  cancelJoinRequest(): void {
    this.http.delete(`http://localhost:8080/api/groups/${this.groupResponse.id}/join-request`)
        .subscribe(_ => {
          this.groupResponse.isRequestSent = false;
        });
  }

  toggleMoreActions() {
    this.isMoreActionsVisible = !this.isMoreActionsVisible;
  }
}
