import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {fromEvent, merge, timer} from 'rxjs';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {ConfirmDialogService} from '../../../../logged-in/confirm-dialog/confirm-dialog.service';
import {MessageService} from '../../../services/message.service';
import {UserDto} from '../../../models/user-dto';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-user-ref-popup',
  templateUrl: './user-ref-popup.component.html',
  styleUrls: ['./user-ref-popup.component.scss']
})
export class UserRefPopupComponent implements OnInit {

  moreActionOptsVisible = false;
  friendOptsVisible = false;
  currentTarget: HTMLElement | null = null;
  userDto: UserDto | undefined;
  userInfos: any[] = [];

  @ViewChild('self', {static: true}) self!: ElementRef;

  constructor(
    private router: Router,
    private confirmService: ConfirmDialogService,
    private messageService: MessageService,
    private renderer: Renderer2,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.listenOnMouseOverMouseLeave();
    this.configureHideOnRouteChange();
    this.configureHideOnScroll();
  }

  listenOnMouseOverMouseLeave() {
    this.messageService.userRef$.pipe(
      filter(data => data.visible),
      filter(data => data.target != this.currentTarget),
      tap(data => {
        this.hide();
        this.currentTarget = data.target;
        this.userDto = data.userDto;
        timer(50).subscribe(() => this.move(data.target))
      }),
      switchMap(() => timer(300))
    ).subscribe(() => {
      if (this.currentTarget) {
        this.show()
      }
    });
  }

  configureHideOnScroll() {
    let lastMousePosition = {
      x: -1,
      y: -1,
    }

    fromEvent(window, 'mousemove')
    .pipe(filter(() => !!this.currentTarget)).subscribe((e: any) => {
      lastMousePosition.x = e.clientX;
      lastMousePosition.y = e.clientY;
    });

    fromEvent(window, 'scroll').subscribe(() => {
      if (this.currentTarget) {
        const selfRect = this.self.nativeElement.getBoundingClientRect();
        if (this.isMouseOut(selfRect, lastMousePosition)) {
          this.hide();
          this.currentTarget = null;
        }
      }
    });
  }

  configureHideOnRouteChange() {
    merge(
      this.messageService.userRef$.pipe(
        switchMap(data => timer(50).pipe(map(() => data.visible))),
        filter(visible => !visible)
      ),
      this.router.events
    ).subscribe(() => {
      this.hide();
      this.setSelfStyle('top', '0px');
      this.currentTarget = null;
    });
  }

  isMouseOut(targetRect: DOMRect, mousePosition: {x: number, y: number}): boolean {
    return targetRect.left > mousePosition.x
      || targetRect.right  < mousePosition.x
      || targetRect.top    > mousePosition.y
      || targetRect.bottom < mousePosition.y
  }

  onMouseEnter() {
    this.messageService.userRef$.next({
      visible: true,
      target: this.currentTarget
    })
  }

  onMouseLeave() {
    this.messageService.userRef$.next({
      visible: false
    })
  }

  show() {
    this.setSelfStyle('visibility', 'visible');
    this.setSelfStyle('opacity', '1');
  }

  move(target: HTMLElement) {
    const MARGIN = 2;
    const HOR_MARGIN = 5;
    const targetRect = target.getBoundingClientRect();
    const self = this.self.nativeElement;

    let left = targetRect.left + target.offsetWidth/2 - self.offsetWidth/2;
    const SCROLLBAR_WIDTH = window.innerWidth - document.documentElement.clientWidth;
    const windowRightOffset
      = left + self.offsetWidth - (window.innerWidth - HOR_MARGIN - SCROLLBAR_WIDTH);
    if (windowRightOffset >= 0) left -= windowRightOffset;
    left = left < HOR_MARGIN ? HOR_MARGIN : left;


    const isInTopHalf = targetRect.top < window.innerHeight / 2;
    let top =
      isInTopHalf
      ? targetRect.bottom + MARGIN
      : targetRect.top - self.offsetHeight - MARGIN;
    top += window.scrollY;
    this.setSelfStyle('left', left + 'px')
    this.setSelfStyle('top', top + 'px');

  }

  hide(): void {
    this.setSelfStyle('visibility', 'hidden');
    this.setSelfStyle('opacity', '0');
    this.userDto = undefined;
    document.body.click();
  }

  private setSelfStyle(style: string, value: string) {
    this.renderer.setStyle(this.self.nativeElement, style, value);
  }

  mouseLeave(): void {
    this.hide();
  }

  openChatBox(): void {
    this.messageService.openChatBox$.next({
      id: this.userDto!.id,
      profileId: this.userDto!.profileId,
      avatarUrl: this.userDto!.avatarUrl,
      username: this.userDto!.username
    });
  }

  async block() {
    const isConfirmed = await this.confirmService.confirm({
      title: 'Chặn người dùng',
      body: `Bạn có chắc muốn chặn ${this.userDto?.username}?`
    });
    if (isConfirmed) {
      this.userService.block(this.userDto!.id).subscribe(() => window.location.reload());
    }
  }
}
