import {animate, style, transition, trigger} from '@angular/animations';
import {Component, ElementRef, EventEmitter, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MessageService} from '../message.service';
import {UserDto} from '../user-dto';

@Component({
  selector: 'app-user-ref',
  templateUrl: './user-ref.component.html',
  styleUrls: ['./user-ref.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('.1s .4s', style({opacity: 1}))
      ]),
      transition(':leave', [
        animate(100, style({opacity: 0}))
      ])
    ])
  ]
})

export class UserRefComponent implements OnInit {

  @Input() userDto!: UserDto;
  @Input() borderRadius!: string;
  @Input() isPhotoView: boolean = false;
  @ViewChild('avatarContainer') avatarContainer!: ElementRef;

  popupVisibility = new EventEmitter<any>();
  isUserRefVisible = false;

  constructor(private renderer: Renderer2,
              private self: ElementRef,
              private message$: MessageService) {
  }

  ngAfterViewInit() {
    if (this.borderRadius) {
      this.renderer.setStyle(this.avatarContainer.nativeElement,
        'border-radius', this.borderRadius);
    }
  }

  ngOnInit(): void {

  }

  onMouseEnter(): void {
    if (this.isPhotoView) return;

    this.popupVisibility.emit({
      msg: 'show',
      rect: this.self.nativeElement.getBoundingClientRect(),
      self: this.self.nativeElement,
      userDto: this.userDto
    });
  }

  onMouseLeave(): void {
    this.popupVisibility.emit({
      msg: 'hide'
    });
  }
}
