import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from '../../common/message.service';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-join-request-list',
  templateUrl: './join-request-list.component.html',
  styleUrls: ['./join-request-list.component.scss']
})
export class JoinRequestListComponent implements OnInit, OnDestroy {

  joinRequests!: any[];
  dummy!: any[];

  private destroyed$ = new ReplaySubject<boolean>(1);

  constructor(private groupService: GroupService,
    private messageService: MessageService) { }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.messageService.groupLoaded
    .pipe(takeUntil(this.destroyed$))
    .subscribe(group => {
      if (!group) return;

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
    let pattern: string = event.target.value;

    this.joinRequests = this.dummy.filter((req: any) => {
      let name = req.user.username.normalize("NFD")
            .replace(/\p{Diacritic}/gu, '')
            .toLowerCase();
      return name.includes(pattern);
    });
  }

}
