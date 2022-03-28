import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ToasterMessageType} from './toaster-message-type';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  public message$ = new Subject<{type: ToasterMessageType, message: string}>();
  constructor() { }
}
