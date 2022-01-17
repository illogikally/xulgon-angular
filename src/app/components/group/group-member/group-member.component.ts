import {HttpClient} from '@angular/common/http';
import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MessageService} from '../../common/message.service';
import {GroupResponse} from '../group-response';
import {GroupService} from '../group.service';

@Component({
  selector: 'app-group-member',
  templateUrl: './group-member.component.html',
  styleUrls: ['./group-member.component.scss']
})
export class GroupMemberComponent implements OnInit, OnDestroy {

  members = new Array<any>();
  admins = new Array<any>();

  groupId!: number;
  groupProfile!: GroupResponse;
  private destroyed$ = new ReplaySubject<boolean>(1);

  @ViewChild('opts') opts!: ElementRef;
  memberOptsVisible = false;

  constructor(private http: HttpClient,
              private renderer: Renderer2,
              private group$: GroupService,
              private messageService: MessageService) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.messageService.groupLoaded.subscribe(group => {
      if (!group) return;
      this.groupProfile = group;
    });
    this.messageService.onLoadPostsByPageId()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(id => {
        if (!id) return;
        this.groupId = id;

        this.http.get<any[]>(`http://localhost:8080/api/groups/${id}/members`).subscribe(members => {
          this.members = members;
          console.log(members);

          this.admins = members.filter(m => m.role == 'ADMIN');
          this.members = members.filter(m => m.role == 'MEMBER');
        });
      });
  }

  promote(member: any): void {
    this.group$.promote(member.user.id, this.groupId).subscribe(_ => {
      this.admins.push(member);
      this.members = this.members.filter(e => e.user.id != member.user.id);
    });
  }

  kick(member: any): void {
    this.group$.kick(member.user.id, this.groupId).subscribe(_ => {
      this.admins = this.admins.filter(e => e.user.id != member.user.id);
      this.members = this.members.filter(e => e.user.id != member.user.id);
    });
  }

  showOpts(event: any): void {
  }
}
