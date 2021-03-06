import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AuthenticationService} from 'src/app/core/authentication/authentication.service';
import {ConfirmDialogService} from 'src/app/logged-in/confirm-dialog/confirm-dialog.service';
import {PhotoResponse} from 'src/app/shared/components/photo/photo-response';
import {PhotoService} from 'src/app/shared/components/photo/photo.service';

@Component({
  selector: 'app-photo-list-item',
  templateUrl: './photo-list-item.component.html',
  styleUrls: ['./photo-list-item.component.scss']
})
export class PhotoListItemComponent implements OnInit {

  @Input() photo!: PhotoResponse;
  @Input() setId?: number;
  @Output() photoDeleted: EventEmitter<number> = new EventEmitter();
  principalId = this.authenticationService.getPrincipalId();
  isOptionsVisible: boolean = false;

  @ViewChild('optionsBtn') optionsBtn!: ElementRef;

  constructor(
    private authenticationService: AuthenticationService,
    private photoService: PhotoService,
    private confirmService: ConfirmDialogService
  ) {
  }

  ngOnInit(): void {
  }

  async deletePhoto() {
    const isConfirmed = await this.confirmService.confirm({
      title: 'Xoá hình ảnh',
      body: 'Bạn có chắc muốn xoá ảnh này?'
    });

    if (isConfirmed) {
      this.photoService.delete(this.photo.id).subscribe(() => {
        this.photoDeleted.emit(this.photo.id);
      });
    }
  }
}
