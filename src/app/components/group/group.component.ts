import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from '../share/message.service';
import { TitleService } from '../share/title.service';
import {GroupResponse} from './group-response';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {

  groupResponse!: GroupResponse;

  @ViewChild('moreAction') moreAction!: ElementRef;

  constructor(
    private location: Location,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private titleService: TitleService,
    private http: HttpClient) {
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
    this.http.get<GroupResponse>(`http://localhost:8080/api/groups/${id}`).subscribe(resp => {
      this.titleService.setTitle(resp.name);
      this.groupResponse = resp;
      this.messageService.groupLoaded.next(resp);
    }, error => {
    });

  }


}
