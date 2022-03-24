import {Component, ElementRef, EventEmitter, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {filter} from 'rxjs/operators';
import {MessageService} from '../message.service';
import {UserDto} from '../user-dto';
import {UserService} from '../user.service';

@Component({
  selector: 'app-user-ref',
  templateUrl: './user-ref.component.html',
  styleUrls: ['./user-ref.component.scss'],
})

export class UserRefComponent implements OnInit {

  @Input() userDto!: UserDto;
  @Input() borderRadius!: string;
  @Input() isPhotoView: boolean = false;
  @Input() size: 40 | 100 | 200 | 400 | 600 | 900 = 40;
  @ViewChild('avatarContainer') avatarContainer!: ElementRef;

  popupVisibility = new EventEmitter<any>();
  isUserRefVisible = false;

  constructor(
    private userService: UserService,
    private renderer: Renderer2,
    private self: ElementRef,
    private messageService: MessageService
  ) { }

  ngAfterViewInit() {
    if (this.borderRadius) {
      this.renderer.setStyle(
        this.avatarContainer.nativeElement,
        'border-radius',
        this.borderRadius
      );
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
