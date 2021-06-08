import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Post } from '../post/post';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private subject = new Subject<string>();
  private friendRequestChange = new Subject<number>();
  private friendshipStatus = new Subject<string>();
  private createdPost = new Subject<Post>();


  constructor() { }

  onFriendshipStatusChange(): Observable<string> {
    return this.friendshipStatus.asObservable();
  }

  onCreatedPost(): Observable<Post> {
    return this.createdPost.asObservable();
  }

  sendCreatedPost(post: Post): void {
    this.createdPost.next(post);
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
