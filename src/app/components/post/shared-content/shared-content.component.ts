import { Component, Input, OnInit } from '@angular/core';
import { SharedContent } from '../shared-content';

@Component({
  selector: 'app-shared-content',
  templateUrl: './shared-content.component.html',
  styleUrls: ['./shared-content.component.scss']
})
export class SharedContentComponent implements OnInit {

  @Input() content?: SharedContent;
  @Input() mediaMargin = '0px 0px';
  @Input() isCreatePostChild = false;
  @Input() isDisabled = false;
  constructor() { }

  ngOnInit(): void {
  }

}
