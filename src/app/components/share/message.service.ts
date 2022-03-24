import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';
import {OpenAvatarPickerData} from '../profile/pick-avatar/open-avatar-picker-data';
import {PhotoResponse} from './photo/photo-response';
import {UserBasic} from './user-basic';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  popUp$ = new Subject<any>();
  routeReuse$ = new Subject<ActivatedRouteSnapshot>();

  updateAvatar = new Subject<{photo: PhotoResponse, pageId: number}>();
  updateCoverPhoto = new Subject<{photo: PhotoResponse, pageId: number}>();
  updateAvatarOrCover = new Subject<OpenAvatarPickerData>();
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
