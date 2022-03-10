import { Location } from '@angular/common';
import { AfterViewInit, Component, DoCheck, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Tab } from './tab';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
})
export class TabBarComponent implements OnInit, AfterViewInit {

  @Input() tabs!: Tab[];

  @Input() pageId!: number;
  @Input() pageName = '';
  @Input() avatar = '';
  @Input() pagePath = '';
  @Input() pageType = 'PROFILE';
  @Input() blocked = false;

  @ViewChild('tabsElement') tabsElement!: ElementRef;
  @ViewChild('tabsWrapper') tabsWrapperElement!: ElementRef;
  @ViewChild('moreTabs') moreTabsElement!: ElementRef;
  @ViewChild('actionMenu', {static: true}) tabBarElement!: ElementRef;

  hiddenTabs: any[] = [];
  isTabBarSticky = false;
  isMoreTabsVisible = false;
  isTabBarConfigured = false;

  constructor(
    private location: Location,
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
        let [lastTab] = this.tabs.slice(-1);
        while (lastTab && isLastTabOverflowed(lastTab)) {
          this.hiddenTabs.unshift(this.tabs.pop());
          [lastTab] = this.tabs.slice(-1);
        }

        let firstHiddenTab = this.hiddenTabs[0];
        while (firstHiddenTab && isThereSpaceToFitHiddenTab(firstHiddenTab)) {
          this.tabs.push(this.hiddenTabs.shift());
          firstHiddenTab = this.hiddenTabs[0];
        }

        this.isTabBarConfigured = true;
      });
      isRunning = false;
    }).observe(this.tabsWrapperElement.nativeElement);
  }

  saveTabSizes() {
    const tabs = this.tabsElement.nativeElement.children;
    this.tabs[0].distance = tabs[0].offsetWidth;
    for (let i = 1; i < this.tabs.length; ++i) {
      this.tabs[i].distance = tabs[i].offsetWidth + this.tabs[i-1].distance;
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

  locationGo(path: string) {
    path = `/${this.pageId}/${path}`;
    path = this.pageType == 'PROFILE' ? path : '/groups' + path;
    this.location.go(path)
  }

  href(path: string) {
    path = `/${this.pageId}/${path}`;
    path = this.pageType == 'PROFILE' ? path : '/groups' + path;
    return path;
  }
}
