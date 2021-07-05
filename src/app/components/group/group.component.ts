import { HashLocationStrategy, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../common/message.service';
import { GroupResponse } from './group-response';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {

  groupResponse!: GroupResponse;

  @ViewChild('moreAction') moreAction!: ElementRef;

  constructor(private location: Location,
    private message$: MessageService,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private http: HttpClient) { 
  }
  
  ngOnDestroy(): void {
    this.message$.groupLoaded.next(null);
  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      const id = +(params.get('id') as string);
      this.getGroupProfile(id);
    });
  }

  getGroupProfile(id: number): void {
    this.message$.loadPostsByPageId(id);
    this.http.get<GroupResponse>(`http://localhost:8080/api/groups/${id}`).subscribe(resp => {
      this.title.setTitle(resp.name);
      this.groupResponse = resp;
      this.message$.groupLoaded.next(resp);
    }, error => {
      console.log("Group Not found");
    });

  }



}
