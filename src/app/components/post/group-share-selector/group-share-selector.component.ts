import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { slideInOutLeft } from '../../share/animations/slide-in-out-left.animation';
import { slideInOutRight } from '../../share/animations/slide-in-out-right.animation';
import { AnimationEvent } from '@angular/animations';
import { PostService } from '../post.service';
import { GroupResponse } from '../../group/group-response';
import { UserService } from '../../share/user.service';
import { FormControl } from '@angular/forms';
import { SharedContent } from '../shared-content';

@Component({
  selector: 'app-group-share-selector',
  templateUrl: './group-share-selector.component.html',
  styleUrls: ['./group-share-selector.component.scss'],
  animations: [slideInOutLeft, slideInOutRight]
})
export class GroupShareSelectorComponent implements OnInit {

  @ViewChild('self') self!: ElementRef;
  toggleModalNgIf = new Subject<any>();

  groups: GroupResponse[] = [];
  groupsClone!: GroupResponse[];

  selectedGroup!: GroupResponse;
  sharedContent!: SharedContent;
  isTransitioned = false;
  isLoading = false;
  search = new FormControl('');
  constructor(
    private userService: UserService,
    private renderer: Renderer2,
    private postService: PostService
  ) { }

  ngOnInit(
  ): void {
    this.onSearch();
    this.onOpenCalled();
  }


  getGroups() {
    this.isLoading = true;
    this.userService.getJoinedGroups().subscribe(groups => {
      this.isLoading = false;
      this.groups = groups;
      this.groupsClone = groups;
    });
  }

  onOpenCalled() {
    this.postService.onOpenGroupShareSelectorCalled().subscribe(content => {
      if (this.groups.length == 0) {
        this.getGroups();
      }
      this.sharedContent = content;
      this.toggleModalNgIf.next();
    });
  }

  calculateHeight(event: AnimationEvent) {
    if (event.toState === null) {
      const self = this.self.nativeElement;
      const eventHeight = event.element.offsetHeight;
      this.renderer.setStyle(self, 'height', eventHeight + 'px');
    }
  }

  discardHeight(event: AnimationEvent) {
    if (event.toState === null) {
      const self = this.self.nativeElement;
      this.renderer.setStyle(self, 'height', 'auto');
      this.renderer.setStyle(self, 'overflow', 'visible');
    }
  }

  transition() {
    const self = this.self.nativeElement;
    this.renderer.setStyle(self, 'height', self.offsetHeight + 'px');
    this.renderer.setStyle(self, 'overflow', 'hidden');
    setTimeout(() => {
      this.isTransitioned = !this.isTransitioned;
    }, 10);
  }

  itemClicked(group: GroupResponse) {
    this.selectedGroup = group;
    this.transition();
  }

  onSearch() {
    this.search.valueChanges.subscribe(value => {
      this.groups = this.groupsClone.filter(group => group.name.toLowerCase().indexOf(value) != -1);
    })
  }

  reset() {
    this.isTransitioned = false;
  }
}
