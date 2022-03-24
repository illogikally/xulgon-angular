import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {ConfirmDialogService} from './confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  title = '';
  body = '';
  dialogId = 0;

  toggleModal = new Subject<any>();
  constructor(
    private confirmService: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.confirmService.dialog$
    .pipe(filter(message => !!message.title))
    .subscribe(message => {
      this.dialogId = message.id;
      this.title = message.title as string;
      this.body = message.body as string;
      this.show();
    });
  }

  response(isConfirmed: boolean) {
    this.confirmService.dialog$.next({
      id: this.dialogId,
      isConfirmed: isConfirmed
    });
    this.hide();
    this.dialogId = 0;
  }

  show() {
    this.toggleModal.next();
  }

  hide() {
    this.toggleModal.next();
  }
}
