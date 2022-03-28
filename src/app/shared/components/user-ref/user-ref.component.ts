import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Renderer2,
  RendererStyleFlags2,
  ViewChild
} from '@angular/core';
import {filter} from 'rxjs/operators';
import {MessageService} from '../../services/message.service';
import {UserDto} from '../../models/user-dto';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-user-ref',
  templateUrl: './user-ref.component.html',
  styleUrls: ['./user-ref.component.scss'],
})

export class UserRefComponent implements OnInit {

  @Input() userDto!: UserDto;
  @Input() borderRadius = '';
  @Input() isPhotoView = false;
  @Input() size: 40 | 100 | 200 | 400 | 600 | 900 = 40;
  @Input() fontSize = '15px';
  @Input() fontWeight = '500';
  @ViewChild('self') container!: ElementRef;

  popupVisibility = new EventEmitter<any>();
  isUserRefVisible = false;

  constructor(
    private userService: UserService,
    private renderer: Renderer2,
    private self: ElementRef,
    private messageService: MessageService
  ) { }

  ngAfterViewInit() {
    const style = {
      '--avatar-border-radius': this.borderRadius,
      '--font-weight': this.fontWeight,
      '--font-size': this.fontSize
    }

    for (const [variable, value] of Object.entries(style)) {
      this.renderer.setStyle(this.container.nativeElement, variable, value, RendererStyleFlags2.DashCase);
    }
  }

  ngOnInit(): void {
    this.listenOnFriendshipStatusChange();
  }

  onMouseEnter(): void {
    this.messageService.userRef$.next({
      visible: true,
      target: this.self.nativeElement,
      userDto: this.userDto
    });
  }

  onMouseLeave(): void {
    this.messageService.userRef$.next({
      visible: false
    })
  }

  listenOnFriendshipStatusChange() {
    this.userService.updateFriendshipStatus$.pipe(
      filter(data => data.userId == this.userDto.id)
    ).subscribe(data => {
      this.userDto.friendshipStatus = data.status;
    })
  }
}
