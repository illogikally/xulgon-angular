import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroupService} from '../../group.service';

@Component({
  selector: 'app-join-request-item',
  templateUrl: './join-request-item.component.html',
  styleUrls: ['./join-request-item.component.scss']
})
export class JoinRequestItemComponent implements OnInit {

  @Input() request!: any;
  @Output() destroy: EventEmitter<number> = new EventEmitter();

  constructor(private groupService: GroupService) {
  }

  ngOnInit(): void {
  }

  accept(): void {
    this.groupService.acceptRequest(this.request.id).subscribe(_ => {
      this.destroy.emit(this.request.id);
    });
  }

  decline(): void {
    this.groupService.declineRequest(this.request.id).subscribe(_ => {
      this.destroy.emit(this.request.id);
    });
  }
}
