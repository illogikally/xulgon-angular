import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ReplaySubject} from 'rxjs';
import {filter, take, takeUntil} from 'rxjs/operators';
import {MessageService} from '../../share/message.service';
import {GroupService} from '../group.service';

@Component({
  selector: 'app-join-request-list',
  templateUrl: './join-request-list.component.html',
  styleUrls: ['./join-request-list.component.scss']
})
export class JoinRequestListComponent implements OnInit, OnDestroy {

  joinRequests!: any[];
  dummy!: any[];

  private destroyed$ = new ReplaySubject<boolean>(1);

  constructor(
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private messageService: MessageService) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.getRequests();
  }

  getRequests() {
    const groupId = Number(this.activatedRoute.snapshot.parent?.paramMap.get('id'));
    this.groupService.getJoinRequests(groupId).subscribe(requests => {
      this.joinRequests = requests;
      this.dummy = this.joinRequests;
    })
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
