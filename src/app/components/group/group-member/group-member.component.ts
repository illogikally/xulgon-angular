import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../common/message.service';

@Component({
  selector: 'app-group-member',
  templateUrl: './group-member.component.html',
  styleUrls: ['./group-member.component.scss']
})
export class GroupMemberComponent implements OnInit {

  members!: any[];
  admins!: any[];

  constructor(private http: HttpClient,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.pageId.subscribe(id => {

      this.http.get<any[]>(`http://localhost:8080/api/groups/${id}/members`).subscribe(members => {
        this.members = members;
        this.admins = members.filter(m => m.role == 'ADMIN');
        this.members = members.filter(m => m.role == 'MEMBER');
      });
    });
  }

}
