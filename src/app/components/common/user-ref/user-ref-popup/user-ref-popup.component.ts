import {Component, ElementRef, EventEmitter, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MessageService} from '../../message.service';
import {UserDto} from '../../user-dto';
import {UserService} from '../../user.service';

@Component({
  selector: 'app-user-ref-popup',
  templateUrl: './user-ref-popup.component.html',
  styleUrls: ['./user-ref-popup.component.scss']
})
export class UserRefPopupComponent implements OnInit {

  moreActionOptsVisible = false;
  friendOptsVisible = false;
  @Input() userDto!: UserDto;
  @Input() visibility!: EventEmitter<any>;

  @ViewChild('self', {static: true}) self!: ElementRef;

  constructor(
    private message$: MessageService,
    private userService: UserService,
    private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.visibility.subscribe(data => {
      if (data.msg === 'show') {
        this.show(data.rect);
      } else {
        this.hide();
      }
    });
  }

  move(rect: DOMRect): void {
    // let thisRect = this.self.nativeElement.getBoundingClientRect();
    // let thisHeight  = this.self.nativeElement.offsetHeight;
    // let y           = rect.top < window.innerHeight/2 ? rect.bottom-1 : rect.top-thisHeight+1;
    // this.setSelfStyle('top'       , y + 'px');

  }

  show(rect: DOMRect): void {

    let targetWidth = rect.bottom - rect.top;
    let thisWidth = this.self.nativeElement.offsetWidth;
    let thisHeight = this.self.nativeElement.offsetHeight;
    let x = rect.x - (thisWidth - targetWidth) / 2;
    let y = rect.top < window.innerHeight / 2 ? rect.bottom - 1 : rect.top - thisHeight + 1;

    this.setSelfStyle('left', x + 'px')
    this.setSelfStyle('top', y + 'px');
    this.setSelfStyle('transition', 'opacity .1s linear .5s');
    this.setSelfStyle('visibility', 'visible');
    this.setSelfStyle('opacity', '1');
  }

  hide(): void {
    this.setSelfStyle('transition', 'none');
    this.setSelfStyle('visibility', 'hidden');
    this.setSelfStyle('opacity', '0');
    this.moreActionOptsVisible = false;
    this.friendOptsVisible = false;
  }

  private setSelfStyle(style: string, value: string) {
    this.renderer.setStyle(this.self.nativeElement, style, value);
  }

  mouseLeave(): void {
    this.hide();
  }

  unfriend(): void {
    this.userService.unfriend(this.userDto.id)
      .subscribe(_ => this.userDto.friendshipStatus = 'NULL');
  }

  deleteRequest(): void {
    this.userService.deleteFriendRequest(this.userDto.id)
      .subscribe(_ => this.userDto.friendshipStatus = 'NULL')
  }

  acceptRequest(): void {
    this.userService.acceptFriendRequest(this.userDto.id)
      .subscribe(_ => this.userDto.friendshipStatus = "FRIEND")
  }

  sendRequest(): void {
    this.userService.sendFriendRequest(this.userDto.id)
      .subscribe(_ => this.userDto.friendshipStatus = "SENT")
  }

  openChatBox(): void {
    this.message$.openChatBox.next({
      id: this.userDto.id,
      avatarUrl: this.userDto.avatarUrl,
      username: this.userDto.username
    });
  }


}
