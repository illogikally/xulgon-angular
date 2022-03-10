import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorPageService {

  private show = new Subject<any>();
  constructor() { }

  showErrorPage() {
    this.show.next();
  }

  onShowListen(): Observable<any> {
    return this.show.asObservable();
  }
}
