import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from '../common/message.service';
import { FriendRequestDto } from '../friend-request/friend-request-dto';

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

  constructor(private http: HttpClient,
    private location: Location,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  preventDefault(event: any): void {
    event.preventDefault();
    if (event.target == this.acceptBtn.nativeElement 
        || event.target == this.declineBtn.nativeElement) {
      return;
    }

    this.messageService.changeFriendRequest(this.request.requesterId);
    this.profilePicked.emit(true);
    this.location.go("/" + this.request.requesterId);
  }

  acceptRequest(): void {
    this.http.post(`http://localhost:8080/api/users/${this.request.requesterId}/friends`, {})
        .subscribe(_ => {
          this.messageService.changeFriendshipStatus('FRIEND');
          this.onDeleteRequest.emit(this.request);
        })
  }

  deleteRequest(): void {
    this.http.delete(`http://localhost:8080/api/users/${this.request.requesterId}/friend-requests`)
        .subscribe(_ => {
          this.onDeleteRequest.emit(this.request);
        })
  }

}