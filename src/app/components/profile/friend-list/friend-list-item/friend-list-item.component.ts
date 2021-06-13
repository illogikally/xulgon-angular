import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/components/authentication/authentication.service';
import { UserDto } from 'src/app/components/common/user-dto';
import { UserService } from 'src/app/components/common/user.service';

@Component({
  selector: 'app-friend-list-item',
  templateUrl: './friend-list-item.component.html',
  styleUrls: ['./friend-list-item.component.scss']
})
export class FriendListItemComponent implements OnInit {

  @Input() userDto!: UserDto;
  @ViewChild('optionsBtn', {static: true}) optionsBtn!: ElementRef;
  @Output() removeItem: EventEmitter<UserDto> = new EventEmitter();
  
  isOptionsVisible: boolean = false;
  loggedInUserId!: number;

  constructor(private userService: UserService,
    private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.loggedInUserId = this.auth.getUserId();
  }

  showOptions(): void {
    this.isOptionsVisible = !this.isOptionsVisible;
  }

  hideOptions(event: any): void {
    let btnAndChildren = [...this.optionsBtn.nativeElement.children,
                            this.optionsBtn.nativeElement];

    if (!btnAndChildren.includes(event.target)) {
      this.isOptionsVisible = false;
    }
  }

  unfriend(): void {
    
    this.userService.unfriend(this.userDto.id).subscribe(_ => {
      this.removeItem.emit(this.userDto);
    });
  }
}