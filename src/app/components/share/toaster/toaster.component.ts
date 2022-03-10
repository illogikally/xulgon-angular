import { Component, OnInit } from '@angular/core';
import { ToasterMessageType } from './toaster-message-type';
import { ToasterService } from './toaster.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {

  constructor(
    private toasterService: ToasterService
  ) { }

  MessageType = ToasterMessageType;
  isToasterHidden = true;
  messageType!: ToasterMessageType;
  message = '';

  ngOnInit(): void {
    this.configureOnNewMessage();
  }

  configureOnNewMessage() {
    this.toasterService.message$.subscribe(message => {
      this.messageType = message.type;
      this.message = message.message;
      this.displayToaster();
      setTimeout(() => {
        this.hideToaster(); 
      }, 5000);
    });
  }

  displayToaster() {
    this.isToasterHidden = false;
  }

  hideToaster() {
    this.isToasterHidden = true;
  }
}
