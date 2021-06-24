import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../common/message.service';

@Component({
  selector: 'app-group-feed',
  templateUrl: './group-feed.component.html',
  styleUrls: ['./group-feed.component.scss']
})
export class GroupFeedComponent implements OnInit {

  posts!: any[]
  constructor(private http: HttpClient,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.pageId.next(130);
  }

}
