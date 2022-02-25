import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MessageService} from '../../share/message.service';
import {GroupResponse} from '../group-response';
import {GroupService} from '../group.service';

@Component({
  selector: 'app-group-content',
  templateUrl: './group-content.component.html',
  styleUrls: ['./group-content.component.scss']
})
export class GroupContentComponent implements OnInit, OnDestroy {

  groupResponse!: GroupResponse;
  loadedTabs = new Set<string>();
  currentTab = '';
  isMoreActionsVisible = false;

  private destroyed$ = new ReplaySubject<boolean>(1);

  constructor(
    private location: Location,
    private groupService: GroupService,
    private message$: MessageService,
    private renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient) {
  }

  ngOnDestroy() {
    // this.message$.groupLoaded.next(null);
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {

    this.message$.groupLoaded
      .pipe(takeUntil(this.destroyed$))
      .subscribe(groupResponse => {
        if (!groupResponse) return;


        this.groupResponse = groupResponse;
      });
  }

  onAttach() {
    console.log('attach');
    
    this.groupService.attach$.next(this.groupResponse.id);
  }

  onDetach() {
    this.groupService.detach$.next(this.groupResponse.id);
  }

  sendJoinRequest(): void {
    this.http.post(`http://localhost:8080/api/groups/${this.groupResponse.id}/join-requests`, {})
      .subscribe(_ => {
        this.groupResponse.isRequestSent = true;
      });
  }

  cancelJoinRequest(): void {
    this.http.delete(`http://localhost:8080/api/groups/${this.groupResponse.id}/join-requests`)
      .subscribe(_ => {
        this.groupResponse.isRequestSent = false;
      });
  }

  toggleMoreActions() {
    this.isMoreActionsVisible = !this.isMoreActionsVisible;
  }

  leaveGroup(): void {
    this.groupService.leaveGroup(this.groupResponse.id).subscribe(_ => {
      window.location.reload();
    });
  }

}
