import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  title = '';
  body = '';
  dialogId = '';

  @ViewChild('self', {static: true}) self!: ElementRef;
  constructor(
    private messagesService: MessageService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.messagesService.confirmDialog$
    .pipe(filter(message => message.isPost))
    .subscribe(message => {
      this.dialogId = message.id;
      this.title = message.title;
      this.body = message.body;
      this.show();
    });
  }

  response(isConfirmed: boolean) {
    this.messagesService.confirmDialog$.next({
      isPost: false,
      id: this.dialogId,
      isConfirmed: isConfirmed
    });
    this.hide();
    this.dialogId = '';
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
