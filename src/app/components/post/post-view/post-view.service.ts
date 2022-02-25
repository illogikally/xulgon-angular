import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostViewService {
  highlight$ = new ReplaySubject<any>(1);
  attach$ = new Subject<number>();
  detach$ = new Subject<number>();
  constructor() { }
}
