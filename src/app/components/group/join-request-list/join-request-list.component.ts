import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../common/message.service';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-join-request-list',
  templateUrl: './join-request-list.component.html',
  styleUrls: ['./join-request-list.component.scss']
})
export class JoinRequestListComponent implements OnInit {

  joinRequests!: any[];
  dummy!: any[];

  constructor(private groupService: GroupService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.groupLoaded.subscribe(group => {
      if (!group.id) return;

      this.groupService.getJoinRequests(group.id).subscribe(requests => {
        this.joinRequests = requests;
        this.dummy = this.joinRequests;
      })
    });
  }

  deleteRequest(requestId: number): void {
    this.joinRequests = this.joinRequests.filter(req => req.id != requestId);
  }

  inputChange(event: any): void {
    console.log(event.target.value);
    
    let pattern: string = event.target.value;

    this.joinRequests = this.dummy.filter((req: any) => {
      let name = req.user.username.normalize("NFD")
            .replace(/\p{Diacritic}/gu, '')
            .toLowerCase();
      return name.includes(pattern);
    });
  }

}
