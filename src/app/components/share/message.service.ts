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
  popUp$ = new Subject<any>();

  constructor() {
  }

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


  postView$ = new ReplaySubject<any>(1);

  loadPostsByPageId(pageId: number | undefined): void {
    this.pageId.next(pageId);
  }

  onLoadPostsByPageId(): Observable<number | undefined> {
    return this.pageId.asObservable();
  }


  openChatBox$ = new Subject<UserBasic>();
  updateCoverPhoto = new Subject<string>();
  updateAvatarOrCover = new BehaviorSubject<string>('');
  private userProfileLoaded = new BehaviorSubject<UserProfile>({} as UserProfile);

  onProfileLoaded(): Observable<UserProfile> {
    return this.userProfileLoaded.asObservable();
  }

  sendLoadedProfile(profile: UserProfile): void {
    this.userProfileLoaded.next(profile);
  }
}
