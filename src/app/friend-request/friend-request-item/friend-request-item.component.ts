import {Location} from '@angular/common';
import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {FriendRequestDto} from '../friend-request-dto';

@Component({
  selector: 'app-friend-request-item',
  templateUrl: './friend-request-item.component.html',
  styleUrls: ['./friend-request-item.component.scss']
})
export class FriendRequestItemComponent implements OnInit {

  @Input() request!: FriendRequestDto;
  @ViewChild('accept', {static: true}) acceptBtn!: ElementRef;
  @ViewChild('decline', {static: true}) declineBtn!: ElementRef;

  @Output() onDeleteRequest: EventEmitter<FriendRequestDto> = new EventEmitter();
  @Output() profilePicked: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private userService: UserService,
    private router: Router,
    private location: Location,
    public activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
  }

  accept(event: any): void {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.userService.acceptFriendRequest(this.request.requesterId).subscribe(() => {
      this.onDeleteRequest.emit(this.request);
      this.userService.updateFriendshipStatus$.next({
        userId: this.request.requesterId,
        status: 'FRIEND'
      })
    });
  }

  decline(event: any): void {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.userService.deleteFriendRequest(this.request.requesterId).subscribe(() => {
      this.onDeleteRequest.emit(this.request);
      this.userService.updateFriendshipStatus$.next({
        userId: this.request.requesterId,
        status: 'NULL'
      })
    });
  }

  route(event: any) {
    event.preventDefault();
    this.router.navigate([this.request.requesterProfileId], {
      skipLocationChange: true,
      relativeTo: this.activatedRoute
    });
    this.location.replaceState(`/${this.request.requesterProfileId}`);
  }
}
