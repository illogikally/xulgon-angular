import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {GroupResponse} from '../group/group-response';
import {Post} from '../post/post';
import {UserPage} from '../profile/user-profile';
import { PhotoResponse } from './photo/photo-response';
import {UserBasic} from './user-basic';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  popUp$ = new Subject<any>();
  routeReuse$ = new Subject<ActivatedRouteSnapshot>();

  updateAvatar = new Subject<PhotoResponse>();
  updateCoverPhoto = new Subject<PhotoResponse>();
  constructor() {
  }

  notif = new BehaviorSubject<any>('');
  loadGroupFeed = new Subject<any>();
  generalSearch = new BehaviorSubject<string>('');
  loadGroupProfile = new BehaviorSubject<number | null>(null);
  groupLoaded = new BehaviorSubject<GroupResponse | null>(null);
  userRef$ = new Subject<any>();
  loggedIn = new Subject<void>();
  private pageId = new BehaviorSubject<number | undefined>(undefined);



  loadPostsByPageId(pageId: number | undefined): void {
    this.pageId.next(pageId);
  }

  onLoadPostsByPageId(): Observable<number | undefined> {
    return this.pageId.asObservable();
  }

  openChatBox$ = new Subject<UserBasic>();
  updateAvatarOrCover = new BehaviorSubject<string>('');
  private userProfileLoaded = new BehaviorSubject<UserPage>({} as UserPage);

  onProfileLoaded(): Observable<UserPage> {
    return this.userProfileLoaded.asObservable();
  }

  sendLoadedProfile(profile: UserPage): void {
    this.userProfileLoaded.next(profile);
  }
}
