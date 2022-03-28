import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {filter, take} from 'rxjs/operators';
import {ConfirmData} from './confirm-data';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  dialog$ = new Subject<ConfirmData>();
  constructor() { }

  confirm(data: {title: string, body: string}): Promise<boolean> {
    const id = Date.now();

    this.dialog$.next({
      id: id,
      title: data.title,
      body: data.body
    });

    return new Promise<boolean>(resolve => {
      this.dialog$.pipe(
        filter(response => response.id == id),
        take(1),
      ).subscribe(response => {
        resolve(!!response.isConfirmed)
      });
    });
  }
}
