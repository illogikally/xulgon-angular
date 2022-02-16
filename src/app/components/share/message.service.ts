import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {GroupResponse} from '../group/group-response';
import {Post} from '../post/post';
import {UserProfile} from '../profile/user-profile';
import {UserBasic} from './user-basic';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  confirmDialog$ = new Subject<any>();

  constructor() {
  }

  private friendRequestChange = new Subject<number>();
  private friendshipStatus = new Subject<string>();
  private deleteFriendRequest = new Subject<number>();
  private createdPost = new Subject<Post>();
  notif = new BehaviorSubject<any>('');
  postDeleted = new Subject<number>();
  loadGroupFeed = new Subject<any>();
  generalSearch = new BehaviorSubject<string>('');
  loadGroupProfile = new BehaviorSubject<number | null>(null);
  groupLoaded = new BehaviorSubject<GroupResponse | null>(null);
  userRef$ = new Subject<any>();
  loggedIn = new Subject<void>();
  updateAvatar = new Subject<string>();
  private pageId = new BehaviorSubject<number | undefined>(undefined);


  profileComponentAttached$ = new Subject<number>();
  profileComponentDetached$ = new Subject<number>();

  postView$ = new ReplaySubject<any>(1);


  loadPostsByPageId(pageId: number | undefined): void {
    this.pageId.next(pageId);
  }

  onLoadPostsByPageId(): Observable<number | undefined> {
    return this.pageId.asObservable();
  }


  openChatBox$ = new Subject<UserBasic>();
  // userRef = new Subject<UserDto>();
  updateCoverPhoto = new Subject<string>();
  updateAvatarOrCover = new BehaviorSubject<string>('');
  private userProfileLoaded = new BehaviorSubject<UserProfile>({} as UserProfile);

  sendDeleteFriendRequest(id: number) {
    this.deleteFriendRequest.next(id);
  }

  onDeleteFriendRequest(): Observable<number> {
    return this.deleteFriendRequest.asObservable();
  }

  onProfileLoaded(): Observable<UserProfile> {
    return this.userProfileLoaded.asObservable();
  }

  sendLoadedProfile(profile: UserProfile): void {
    this.userProfileLoaded.next(profile);
  }

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


  onFriendRequestChange(): Observable<number> {
    return this.friendRequestChange.asObservable();
  }

  changeFriendRequest(profileId: number): void {
    this.friendRequestChange.next(profileId);
  }

}
