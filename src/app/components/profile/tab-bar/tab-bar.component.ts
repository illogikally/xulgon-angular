import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../../share/message.service';
import { PhotoResponse } from '../../share/photo/photo-response';
import { UserService } from '../../share/user.service';
import { PageHeader } from '../page-header';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
})
export class TabBarComponent implements OnInit, AfterViewInit {

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

  @Input() pageId!: number;
  @Input() pageName = '';
  @Input() avatar = '';
  @Input() pagePath = '';

  @ViewChild('tabs') tabsElement!: ElementRef;
  @ViewChild('tabsWrapper') tabsWrapperElement!: ElementRef;
  @ViewChild('moreTabs') moreTabsElement!: ElementRef;
  @ViewChild('actionMenu', {static: true}) tabBarElement!: ElementRef;

  hiddenTabs: any[] = [];
  isTabBarSticky = false;
  isMoreTabsVisible = false;
  isTabBarConfigured = false;

  constructor(
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.configureOnTabBarSticky();
    this.saveTabSizes();
    this.configureOnTabBarResize();
  }

  configureOnTabBarResize() {
    const wrapperElement = this.tabsWrapperElement.nativeElement;
    const moreTabsElementWidth = this.moreTabsElement.nativeElement.offsetWidth;
    const tabsButtonsMargin = 60;
    let isRunning = false;

    const isLastTabOverflowed = (tab: any): boolean => {
      return wrapperElement.offsetWidth - tabsButtonsMargin 
          < tab.distance + moreTabsElementWidth
    }

    const isThereSpaceToFitHiddenTab = (tab: any): boolean => {
      return wrapperElement.offsetWidth - tabsButtonsMargin 
          > tab.distance + moreTabsElementWidth
    }
    new ResizeObserver(entries => {
      if (
        isRunning || 
        !entries[0].contentRect.width ||
        !this.tabsWrapperElement || 
        !this.tabsElement 
      ) return;
      isRunning = true;

      this.ngZone.run(() => {
        let [lastTab] = this.visibleTabs.slice(-1);
        while (lastTab && isLastTabOverflowed(lastTab)) {
          this.hiddenTabs.unshift(this.visibleTabs.pop());
          [lastTab] = this.visibleTabs.slice(-1);
        }

        let firstHiddenTab = this.hiddenTabs[0];
        while (firstHiddenTab && isThereSpaceToFitHiddenTab(firstHiddenTab)) {
          this.visibleTabs.push(this.hiddenTabs.shift());
          firstHiddenTab = this.hiddenTabs[0];
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

  configureOnTabBarSticky() {
    const tabBar: HTMLElement = this.tabBarElement.nativeElement;
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.isTabBarSticky = false;
      } else  {
        this.isTabBarSticky = true;
      }
    },
    {
      rootMargin: "-56px 0px 0px 0px",
      threshold: [1]
    }).observe(tabBar);
  }

  scrollToTop(event: any) {
    event.preventDefault();
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}
