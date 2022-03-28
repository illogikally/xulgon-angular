import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {filter} from 'rxjs/operators';
import {ErrorPageService} from '../error-page/error-page.service';
import {TitleService} from '../shared/services/title.service';
import {GroupResponse} from './group-response';
import {GroupService} from './group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {


  group!: GroupResponse;
  defaultCoverPhotoUrl = this.groupService.getDefaultCoverPhotoUrl();

  @ViewChild('moreAction') moreAction!: ElementRef;
  @ViewChild('sidebarBelow') sidebarBelow!: ElementRef;
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('toggleButton') toggleButton!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private renderer: Renderer2,
    private titleService: TitleService,
    private errorPageService: ErrorPageService
  ) {
  }

  ngOnInit(): void {
    this.getGroupFromRouteData();
    this.listenOnMemberAccepted();
  }

  onAttach() {
    this.titleService.setTitle(this.group.name);
  }

  toggleSidebar() {
    const sidebarBelow = this.sidebarBelow.nativeElement;
    const sidebar = this.sidebar.nativeElement;
    const toggleButton = this.toggleButton.nativeElement;
    if (sidebarBelow.style['margin-left'] != '-360px') {
      this.renderer.setStyle(sidebarBelow, 'margin-left', '-360px');
      this.renderer.setStyle(sidebar, 'margin-left', '-360px');
      this.renderer.setStyle(toggleButton, 'right', '-60px');
    }
    else {
      this.renderer.setStyle(sidebarBelow, 'margin-left', '0px');
      this.renderer.setStyle(sidebar, 'margin-left', '0px');
      this.renderer.setStyle(toggleButton, 'right', '20px');
    }
  }

  listenOnMemberAccepted() {
    this.groupService.groupMemberAccepted$.pipe(
      filter(id => id == this.group.id)
    ).subscribe(() => this.group.isMember = true);
  }

  getGroupFromRouteData() {
    const group = this.route.snapshot.data.group;
    if (!group) {
      this.errorPageService.showErrorPage();
      return
    }
    this.group = group;
    this.titleService.setTitle(group.name);
    this.groupService.nextCurrentGroup(group);
  }
}
