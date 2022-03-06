import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../share/message.service';
import { TitleService } from '../share/title.service';
import { GroupResponse } from './group-response';
import { GroupService } from './group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {

  group!: GroupResponse;

  @ViewChild('moreAction') moreAction!: ElementRef;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private titleService: TitleService,
  ) {
  }

  ngOnDestroy(): void {
    this.messageService.groupLoaded.next(null);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = +(params.get('id') as string);
      this.getGroupProfile(id);
    });
  }

  getGroupProfile(id: number): void {
    this.messageService.loadPostsByPageId(id);
    this.groupService.getGroupHeader(id).subscribe(response => {
      this.group = response;
      this.titleService.setTitle(response.name);
      this.groupService.groupResponse$.next(response);
      this.messageService.groupLoaded.next(response);
    });

  }
}
