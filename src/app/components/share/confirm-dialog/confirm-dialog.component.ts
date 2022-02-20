import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { MessageService } from '../message.service';
import { ConfirmDialogService } from './confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  title = '';
  body = '';
  dialogId = 0;

  @ViewChild('self', {static: true}) self!: ElementRef;
  constructor(
    private messagesService: MessageService,
    private confirmService: ConfirmDialogService,
    private renderer: Renderer2
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
    this.renderer.setStyle(this.self.nativeElement, 'visibility', 'visible');
    this.renderer.setStyle(this.self.nativeElement, 'top', '0px');
    this.renderer.setStyle(document.body, 'top', -window.scrollY + 'px');
    this.renderer.setStyle(document.body, 'position', 'fixed');
  }

  hide() {
    const top = -parseInt(document.body.style.top);
    this.renderer.setStyle(this.self.nativeElement, 'visibility', 'hidden');
    this.renderer.removeStyle(document.body, 'position');
    window.scrollTo({top: top});
  }

}
