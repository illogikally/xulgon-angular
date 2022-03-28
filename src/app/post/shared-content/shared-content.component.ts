import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {SharedContent} from '../shared-content';

@Component({
  selector: 'app-shared-content',
  templateUrl: './shared-content.component.html',
  styleUrls: ['./shared-content.component.scss']
})
export class SharedContentComponent implements OnInit, AfterViewInit {

  @Input() content?: SharedContent;
  @Input() mediaMargin = '0px 0px';
  @Input() isCreatePostChild = false;
  @Input() isDisabled = false;
  @ViewChild('postBodyText') postBodyText!: ElementRef;

  isTextClamped = false;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.postBodyText) {
      this.isTextClamped = this.isPostBodyClamped();
    }
  }

  isPostBodyClamped() {
    const body = this.postBodyText.nativeElement;
    return body.scrollHeight > body.clientHeight;
  }

  unclampText() {
    this.postBodyText.nativeElement.style.display = 'block';
    this.isTextClamped = false;
  }
}
