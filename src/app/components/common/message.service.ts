import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private subject = new Subject<string>();
  private friendRequestChange = new Subject<number>();
  private friendshipStatus = new Subject<string>();


  constructor() { }

  onFriendshipStatusChange(): Observable<string> {
    return this.friendshipStatus.asObservable();
  }

  changeFriendshipStatus(status: string): void {
    this.friendshipStatus.next(status);
  }
  onNewMessge(): Observable<string> {
    return this.subject.asObservable();
  }

  onFriendRequestChange(): Observable<number> {
    return this.friendRequestChange.asObservable();
  }

  changeFriendRequest(profileId: number): void {
    this.friendRequestChange.next(profileId);
  }

  sendMessage(msg: string): void {
    this.subject.next(msg);
  }
}
