import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthenticationService} from 'src/app/components/authentication/authentication.service';
import {ConfirmDialogService} from 'src/app/components/share/confirm-dialog/confirm-dialog.service';
import {GroupService} from '../../group.service';

@Component({
  selector: 'app-group-member-item',
  templateUrl: './group-member-item.component.html',
  styleUrls: ['./group-member-item.component.scss']
})
export class GroupMemberItemComponent implements OnInit {

  @Input() member: any;
  @Input() role = '';
  @Input() groupId!: number;

  @Output() kicked = new EventEmitter<number>();
  @Output() promoted = new EventEmitter<number>();
  @Output() demoted = new EventEmitter<number>();

  principalId = this.authenticationService.getPrincipalId();

  constructor(
    private authenticationService: AuthenticationService,
    private confirmService: ConfirmDialogService,
    private groupService: GroupService
  ) {

  }

  ngOnInit(): void {
  }

  promote() {
    this.groupService.promote(this.member.user.id, this.groupId).subscribe(() => {
      this.promoted.emit(this.member.user.id);
    });
  }

  kick() {
    this.confirmService.confirm({
      title: 'Xoá thành viên',
      body: 'Bạn có chắc muốn xoá thành viên này?'
    }).then(isConfirm => {
      if (isConfirm) {
        this.groupService.kick(this.member.user.id, this.groupId).subscribe(() => {
          this.kicked.emit(this.member.user.id);
        });
      }
    })
  }

  demote() {
    this.groupService.demote(this.member.user.id, this.groupId).subscribe(() => {
      this.demoted.emit(this.member.user.id);
    });
  }
}
