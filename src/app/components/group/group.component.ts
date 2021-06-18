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

  @ViewChild('moreAction') moreAction!: ElementRef;

  constructor(private location: Location,
    private messageService: MessageService,
    private renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient) { 
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +(params.get('id') as string);
      this.getGroupProfile(id);
    });
  }

  getGroupProfile(id: number): void {
    this.messageService.pageId.next(id);
    this.http.get<GroupResponse>(`http://localhost:8080/api/groups/${id}`).subscribe(resp => {
      this.groupResponse = resp;
      console.log(resp);
      
      this.messageService.groupLoaded.next(resp);
    }, error => {
      console.log("Group Not found");
    });

  }



}
