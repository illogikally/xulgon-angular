import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { UserDto } from '../../user-dto';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-user-ref-popup',
  templateUrl: './user-ref-popup.component.html',
  styleUrls: ['./user-ref-popup.component.scss']
})
export class UserRefPopupComponent implements OnInit {

  moreActionOptsVisible= false;
  friendOptsVisible = false;

  @Input() userDto!: UserDto;
  constructor(private self: ElementRef,
    private userService: UserService,
    private renderer: Renderer2) { }

  ngOnInit(): void {

    if (this.self.nativeElement.getBoundingClientRect().top < window.innerHeight / 2) {
      this.renderer.setStyle(this.self.nativeElement, 'top', '100%');
      this.renderer.setStyle(this.self.nativeElement, 'bottom', 'auto');
    }
    else {
      this.renderer.setStyle(this.self.nativeElement, 'bottom', '100%');
      this.renderer.setStyle(this.self.nativeElement, 'top', 'auto');
    }
    
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
    console.log('click');
    
    this.userService.sendFriendRequest(this.userDto.id)
    .subscribe(_ => this.userDto.friendshipStatus = "SENT")
  }

}