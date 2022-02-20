import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../../share/message.service';
import { UserService } from '../../share/user.service';
import { PageHeader } from '../page-header';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
})
export class TabBarComponent implements OnInit, AfterViewInit {

  @Input() header!: PageHeader;
  @Input() visibleTabs = [
    {name: 'Bài viết', path: '', distance: NaN, element: undefined},
    {name: 'Giới thiệu', path: 'about', distance: NaN, element: undefined},
    {name: 'Bạn bè', path: 'friends', distance: NaN, element: undefined},
    {name: 'Ảnh', path: 'photos', distance: NaN, element: undefined},
    {name: 'Bài viết', path: '', distance: NaN, element: undefined},
    {name: 'Giới thiệu', path: 'about', distance: NaN, element: undefined},
    {name: 'Bạn bè', path: 'friends', distance: NaN, element: undefined},
    {name: 'Ảnh', path: 'photos', distance: NaN, element: undefined},
  ]

  @ViewChild('tabs') tabsElement!: ElementRef;
  @ViewChild('tabsWrapper') tabsWrapperElement!: ElementRef;
  @ViewChild('moreTabs') moreTabsElement!: ElementRef;
  @ViewChild('actionMenu', {static: true}) tabBarElement!: ElementRef;

  hiddenTabs: any[] = [];
  isTabBarSticky = false;
  isMoreTabsVisible = false;
  isTabBarConfigured = false;

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.onTabBarSticky();
    this.saveTabSizes();
    this.configureOnTabBarResize();
  }

  configureOnTabBarResize() {
    const wrapperElement = this.tabsWrapperElement.nativeElement;
    const moreTabsElementWidth = this.moreTabsElement.nativeElement.offsetWidth;
    const tabsButtonsMargin = 60;
    let isRunning = false;
    new ResizeObserver(() => {
      if (
        isRunning || 
        !this.tabsWrapperElement || 
        !this.tabsElement 
      ) return;
      isRunning = true;

      this.ngZone.run(() => {

        let [lastTab] = this.visibleTabs.slice(-1);
        while (
          lastTab && 
          wrapperElement.offsetWidth - tabsButtonsMargin 
            < lastTab.distance + moreTabsElementWidth
        ) {
          this.hiddenTabs.unshift(this.visibleTabs.pop());
          [lastTab] = this.visibleTabs.slice(-1);
        }

        if (
          this.hiddenTabs[0] &&
          wrapperElement.offsetWidth - tabsButtonsMargin 
            > this.hiddenTabs[0].distance + moreTabsElementWidth
        ) {
          this.visibleTabs.push(this.hiddenTabs.shift());
        }
        this.isTabBarConfigured = true;
      });
      isRunning = false;
    }).observe(this.tabsWrapperElement.nativeElement);
  }

  saveTabSizes() {
    const tabs = this.tabsElement.nativeElement.children;
    this.visibleTabs[0].distance = tabs[0].offsetWidth;
    this.visibleTabs[0].element = tabs[0];
    for (let i = 1; i < this.visibleTabs.length; ++i) {
      this.visibleTabs[i].distance = tabs[i].offsetWidth + this.visibleTabs[i-1].distance;
      this.visibleTabs[i].element = tabs[i];
    }
  }

  onTabBarSticky() {
    const menu: HTMLElement = this.tabBarElement.nativeElement;
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        this.isTabBarSticky = false;
      } else  {
        this.isTabBarSticky = true;
      }
    },
    {
      rootMargin: "-56px 0px 0px 0px",
      threshold: [1]
    });
    observer.observe(menu);
  }

}
