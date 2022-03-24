import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroupResponse} from 'src/app/components/group/group-response';

@Component({
  selector: 'app-group-share-item',
  templateUrl: './group-share-item.component.html',
  styleUrls: ['./group-share-item.component.scss']
})
export class GroupShareItemComponent implements OnInit {

  @Input() group!: GroupResponse;
  @Output() clicked = new EventEmitter<GroupResponse>();

  constructor() { }

  ngOnInit(): void {
  }

  click() {
    this.clicked.emit(this.group);
  }
}
