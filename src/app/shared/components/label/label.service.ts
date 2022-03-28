import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  show$ = new Subject<{target: HTMLElement, text: string, delay: number}>();
  hide$ = new Subject<any>();
  constructor() { }
}
