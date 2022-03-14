import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subject } from 'rxjs';
import { MessageService } from '../../share/message.service';
import { PhotoResponse } from '../../share/photo/photo-response';
import { PhotoService } from '../../share/photo/photo.service';
import { PageHeader } from '../page-header';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-pick-avatar',
  templateUrl: './pick-avatar.component.html',
  styleUrls: ['./pick-avatar.component.scss']
})
export class PickAvatarComponent implements OnInit {

  updateType: 'AVATAR' | 'COVER' = 'AVATAR';
  photos!: PhotoResponse[];
  pickedPhoto!: PhotoResponse | undefined;
  uploadFileForm!: FormGroup;
  photoBlob: Blob | undefined;
  userProfile!: PageHeader;

  aspectRatio = 1;
  imageChangedEvent: any = '';
  toggleModal = new Subject<any>();

  pageSourceId = NaN;
  pageToUpdateId = NaN;
  constructor(
    private profileService: ProfileService,
    private photoService: PhotoService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.uploadFileForm = new FormGroup({
      fileInput: new FormControl('')
    });

    this.messageService.updateAvatarOrCover.subscribe(data => {
      this.toggleModal.next();
      this.pageSourceId = data.pageSourceId;
      this.pageToUpdateId = data.pageToUpdateId;

      if (data.type == 'AVATAR') {
        this.updateType = data.type;
        this.aspectRatio = 1;
      }

      if (data.type == 'COVER') {
        this.updateType = data.type;
        this.aspectRatio = 940 / 350.0;
      }

      this.photoService.getPagePhotos(this.pageSourceId).subscribe(photos => {
        this.photos = photos;
      });
    });

  }

  photoPicked(photo: PhotoResponse): void {
    this.pickedPhoto = photo;
  }

  onSelectFile(event: any): void {
    this.imageChangedEvent = event;
  }

  close(): void {
    this.toggleModal.next();
  }

  reset() {
    this.pickedPhoto = undefined;
    this.photoBlob = undefined;
    this.photos = [];
    this.imageChangedEvent = null;
    this.uploadFileForm.reset();
  }

  abort(): void {
    // For some reason clickoutside triggers
    setTimeout(() => {
      this.pickedPhoto = undefined;
      this.imageChangedEvent = null;
    }, 0);
  }

  confirm(): void {
    let formData = new FormData();

    let photoRequest = new Blob(
      [JSON.stringify({
        privacy: 'PUBLIC',
        pageId: this.pageToUpdateId
      })],
      { type: 'application/json' }
    );
    formData.append('photoRequest', photoRequest);

    formData.append('photo', this.photoBlob == undefined ? new Blob() : this.photoBlob);

    if (this.updateType == 'AVATAR') {
      this.profileService.uploadAvatar(formData, this.pageToUpdateId).subscribe(photo => {
        this.messageService.updateAvatar.next({
          photo: photo,
          pageId: this.pageToUpdateId
        });
      });
    } else {
      this.profileService.uploadCoverPhoto(formData, this.pageToUpdateId).subscribe(photo => {
        this.messageService.updateCoverPhoto.next({
          photo: photo,
          pageId: this.pageToUpdateId
        });
      });
    }
    this.close();
  }

  imageCropped(event: ImageCroppedEvent) {
    if (!event.base64) return;
    this.photoBlob = this.base64toBlob(event.base64);
  }

  base64toBlob(dataURI: string): Blob {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: 'image/jpeg' });
  }

}
