import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../common/message.service';
import { GroupResponse } from '../group-response';

@Component({
  selector: 'app-group-content',
  templateUrl: './group-content.component.html',
  styleUrls: ['./group-content.component.scss']
})
export class GroupContentComponent implements OnInit {

  groupResponse!: GroupResponse;
  loadedTabs = new Set<string>();
  currentTab = '';
  isMoreActionsVisible = false;


  constructor(private location: Location,
    private messageService: MessageService,
    private renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient) { }


  ngOnInit(): void {
    this.initDefaultTab();

    this.messageService.groupLoaded.subscribe(groupResponse => {
      this.groupResponse = groupResponse;
    });

    // this.activatedRoute.parent?.paramMap.subscribe(params => {
    //   const id = params.get('id');
    //   if (id != null) {
    //     this.getGroupProfile(+id);
    //   }
    // });
      
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

}
