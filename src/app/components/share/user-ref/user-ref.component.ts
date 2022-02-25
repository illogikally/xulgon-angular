import {animate, style, transition, trigger} from '@angular/animations';
import {Component, ElementRef, EventEmitter, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MessageService} from '../message.service';
import {UserDto} from '../user-dto';

@Component({
  selector: 'app-user-ref',
  templateUrl: './user-ref.component.html',
  styleUrls: ['./user-ref.component.scss'],
})

export class UserRefComponent implements OnInit {

  @Input() userDto!: UserDto;
  @Input() borderRadius!: string;
  @Input() isPhotoView: boolean = false;
  @ViewChild('avatarContainer') avatarContainer!: ElementRef;

  popupVisibility = new EventEmitter<any>();
  isUserRefVisible = false;
  avatarUrl = this.userDto?.avatarUrl || 'assets/avatar.jpg';

  constructor(
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

  }

  onMouseEnter(): void {
    this.userDto.avatarUrl = this.avatarUrl;
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
}
