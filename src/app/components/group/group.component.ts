import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {filter} from 'rxjs/operators';
import {ErrorPageService} from '../error-page/error-page.service';
import {TitleService} from '../share/title.service';
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
    this.route.paramMap.subscribe(params => {
      const id = +(params.get('id') as string);
      this.getGroupProfile(id);
    });
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

  getGroupProfile(id: number): void {
    this.groupService.getGroupHeader(id).subscribe(response => {
      this.group = response;
      if (response) {
        this.titleService.setTitle(response.name);
        this.groupService.nextCurrentGroup(response);
      }
      else {
        this.errorPageService.showErrorPage();
      }
    }, () => {
      this.errorPageService.showErrorPage();
    }
    );
  }
}
