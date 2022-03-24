import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ReplaySubject} from 'rxjs';
import {filter, take} from 'rxjs/operators';
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
  group!: GroupResponse;
  private destroyed$ = new ReplaySubject<boolean>(1);

  @ViewChild('opts') opts!: ElementRef;
  memberOptsVisible = false;
  isLoadingMembers = false;

  constructor(
    private groupService: GroupService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.getGroupResponseFromParent();
    this.getMembers();
  }

  getGroupResponseFromParent() {
    this.groupService.currentGroup().pipe(
      take(1),
      filter(group => !!group)
    ).subscribe(group => this.group = group);
  }

  getMembers() {
    const groupId = Number(this.activatedRoute.snapshot.parent?.paramMap.get('id'));
    if(!isNaN(groupId)) {
      this.isLoadingMembers = true;
      this.groupService.getMembers(groupId).subscribe(members => {
        this.members = members;
        this.admins = members.filter(m => m.role == 'ADMIN');
        this.members = members.filter(m => m.role == 'MEMBER');
        this.isLoadingMembers = false;
      });
    }
  }

  kicked(id: number) {
    this.admins = this.admins.filter(m => m.user.id != id);
    this.members = this.members.filter(m => m.user.id != id);
  }

  promoted(id: number) {
    const member = this.members.find(m => m.user.id == id);
    this.members = this.members.filter(m => m.user.id != id);
    member.role = 'ADMIN';
    this.admins.push(member);
  }

  demoted(id: number) {
    const admin = this.admins.find(m => m.user.id == id);
    this.admins = this.admins.filter(m => m.user.id != id);
    admin.role = 'ADMIN';
    this.members.push(admin);
  }
}
