import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {fromEvent, Subject} from 'rxjs';
import {MessageService} from '../../share/message.service';
import {PhotoResponse} from '../../share/photo/photo-response';
import {PhotoService} from '../../share/photo/photo.service';
import {ToasterMessageType} from '../../share/toaster/toaster-message-type';
import {ToasterService} from '../../share/toaster/toaster.service';
import {PageHeader} from '../page-header';
import {ProfileService} from '../profile.service';

@Component({
  selector: 'app-pick-avatar',
  templateUrl: './pick-avatar.component.html',
  styleUrls: ['./pick-avatar.component.scss']
})
export class PickAvatarComponent implements OnInit {

  updateType: 'AVATAR' | 'COVER' = 'AVATAR';
  photos: PhotoResponse[] = [];
  pickedPhoto!: PhotoResponse | undefined;
  uploadFileForm!: FormGroup;
  photoBlob: Blob | undefined;
  userProfile!: PageHeader;

  aspectRatio = 1;
  imageChangedEvent: any = '';
  pageSourceId = NaN;
  toggleModal = new Subject<any>();
  pageToUpdateId = NaN;
  isLoading = false;
  isPosting = false;
  hasNext = true;

  @ViewChild('body') body!: ElementRef;
  @ViewChild('photoContainer') photoContainer!: ElementRef;

  constructor(
    private profileService: ProfileService,
    private photoService: PhotoService,
    private toaster: ToasterService,
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

      this.configureInitGetPhotos();
      this.configureLoadPhotoOnScroll();
    });
  }

  async configureInitGetPhotos() {
    for (let i = 0; i < 4; ++i) {
      await this.getPhotos();
    }
  }

  async getPhotos() {
    const size = 5;
    const offset = this.photos.length;
    if (!this.hasNext) return;
    this.isLoading = true;
    const response = await this.photoService.getPagePhotos(this.pageSourceId, size, offset).toPromise();
    this.photos = this.photos.concat(response.data);
    this.hasNext = response.hasNext;
    this.isLoading = false;
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
    this.photos = [];
    this.abort();
    this.hasNext = true;
  }

  configureLoadPhotoOnScroll() {
    fromEvent(this.photoContainer.nativeElement, 'scroll').subscribe(() => {
      const photoContainer
        = this.photoContainer.nativeElement;
      const body = this.body.nativeElement;
      if (
        photoContainer.scrollTop >= photoContainer.offsetHeight - photoContainer.offsetHeight
        && !this.isLoading
        && this.hasNext
      ) {
        this.getPhotos();
      }
    })
  }

  abort(): void {
    // For some reason clickoutside triggers
    setTimeout(() => {
      this.pickedPhoto = undefined;
      this.imageChangedEvent = null;
      this.photoBlob = undefined;
      this.uploadFileForm.reset();
    }, 0);
  }

  confirm(): void {
    this.isPosting = true;
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
      this.profileService.uploadAvatar(
        formData,
        this.pageToUpdateId
      ).subscribe(photo => {
        this.messageService.updateAvatar.next({
          photo: photo,
          pageId: this.pageToUpdateId
        });
        this.isPosting = false;
        this.toaster.message$.next({
          type: ToasterMessageType.SUCCESS,
          message: 'Thay ảnh đại diện thành công'
        })
        this.close();
      }, error => {
        this.toaster.message$.next({
          type: ToasterMessageType.ERROR,
          message: 'Đã có lỗi trong quá trình thay đổi ảnh đại diện'
        })
      });

    } else {
      this.profileService.uploadCoverPhoto(
        formData,
        this.pageToUpdateId
      ).subscribe(photo => {
        this.messageService.updateCoverPhoto.next({
          photo: photo,
          pageId: this.pageToUpdateId
        });
        this.isPosting = false;
        this.toaster.message$.next({
          type: ToasterMessageType.SUCCESS,
          message: 'Thay ảnh bìa thành công'
        })
        this.close();
      }, error => {
        this.toaster.message$.next({
          type: ToasterMessageType.ERROR,
          message: 'Đã có lỗi trong quá trình thay đổi ảnh bìa'
        })
      });
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    if (!event.base64) return;
    console.log(event);

    this.photoBlob = this.base64toBlob(event.base64);
  }

  base64toBlob(dataURI: string): Blob {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], {type: 'image/jpeg'});
  }

}
