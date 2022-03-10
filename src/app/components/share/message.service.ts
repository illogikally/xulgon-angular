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
  updateAvatarOrCover = new Subject<'avatar' | 'cover'>();
  errorPage$ = new Subject<any>();
  constructor() {
  }

  notif = new BehaviorSubject<any>('');
  loadGroupFeed = new Subject<any>();
  generalSearch = new BehaviorSubject<string>('');
  userRef$ = new Subject<any>();
  loggedIn = new Subject<void>();
  openChatBox$ = new Subject<UserBasic>();
}
