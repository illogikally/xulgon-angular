import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ToasterMessageType} from './toaster-message-type';
import {ToasterService} from './toaster.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {

  MessageType = ToasterMessageType;
  isToasterHidden = true;
  messageType!: ToasterMessageType;
  message = '';

  style = {};
  @ViewChild('self') self!: ElementRef;
  constructor(
    private toasterService: ToasterService
  ) { }


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
    const self = this.self.nativeElement;
    self.offsetWidth;
    self.classList.add('slide');
  }

  hideToaster() {
    const self = this.self.nativeElement;
    self.classList.remove('slide');
  }
}
