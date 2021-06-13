import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MessageService } from '../message.service';
import { UserDto } from '../user-dto';

@Component({
  selector: 'app-user-ref-avatar',
  templateUrl: './user-ref-avatar.component.html',
  styleUrls: ['./user-ref-avatar.component.scss'],
  animations: [
  trigger('fadeInOut', [
    transition(':enter', [   // :enter is alias to 'void => *'
      style({opacity:0}),
      animate('.1s .5s', style({opacity:1})) 
    ]),
    transition(':leave', [   // :leave is alias to '* => void'
      animate(100, style({opacity:0})) 
    ])
  ])
]
})
export class UserRefAvatarComponent implements OnInit {

  userRefVisible = false;

  @Input() userDto!: UserDto;
  @Input() borderRadius!: number;

  @ViewChild('userRef', {static: true}) userRef!: ElementRef;
  @ViewChild('imgContainer', {static: true}) imgContainer!: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.renderer.setStyle(this.imgContainer.nativeElement,
        'border-radius', this.borderRadius + 'px');
  }

  onMouseEnter() {

    this.userRefVisible = true;
    
  }

  onMouseLeave() {
    this.userRefVisible = false;
    
    
  }
}
