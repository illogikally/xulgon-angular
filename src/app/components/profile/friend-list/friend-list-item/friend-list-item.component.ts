import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from 'src/app/components/authentication/authentication.service';
import {MessageService} from 'src/app/components/share/message.service';
import {UserDto} from 'src/app/components/share/user-dto';
import {UserService} from 'src/app/components/share/user.service';

@Component({
  selector: 'app-friend-list-item',
  templateUrl: './friend-list-item.component.html',
  styleUrls: ['./friend-list-item.component.scss']
})
export class FriendListItemComponent implements OnInit {

  @Input() userDto!: UserDto;
  @Input() pageId!: number;
  @ViewChild('optionsBtn') optionsBtn!: ElementRef;
  @Output() removeItem: EventEmitter<UserDto> = new EventEmitter();

  isOptionsVisible: boolean = false;
  loggedInUserId!: number;
  loggedInProfileId!: number;

  profileId!: number;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private message$: MessageService,
              private auth: AuthenticationService) {
  }

  ngOnInit(): void {
    this.message$.onLoadPostsByPageId().subscribe(pageId => {
      if (!pageId) return;
      this.profileId = pageId;
    });
    this.loggedInProfileId = this.auth.getProfileId();
    this.loggedInUserId = this.auth.getPrincipalId();
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

  unfollow(): void {
    this.userService.unfollow(this.userDto.id).subscribe(_ => {
      this.userDto.isFollow = false;
    });
  }
}
