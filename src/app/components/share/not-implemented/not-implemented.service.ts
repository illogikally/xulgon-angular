import { Injectable, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotImplementedService {

  show$ = new Subject<HTMLElement>();
  hide$ = new Subject<any>();
  constructor() { }
}
