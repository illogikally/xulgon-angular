import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {fromEvent, Observable, Subject} from 'rxjs';
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
  pickedPhoto?: PhotoResponse; 
  uploadFileForm!: FormGroup;
  photoBlob?: Blob;
  userProfile!: PageHeader;

  aspectRatio = 1;
  imageChangedEvent: any = '';
  pageSourceId = NaN;
  toggleModal = new Subject<any>();
  pageToUpdateId = NaN;
  isCropperLoading = false;
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
      this.pageToUpdateId = data.pageToUpdateId;

      if (data.type == 'AVATAR') {
        this.updateType = data.type;
        this.aspectRatio = 1;
      }
      else if (data.type == 'COVER') {
        this.updateType = data.type;
        this.aspectRatio = 940 / 350.0;
      }

      if (this.pageSourceId != data.pageSourceId) {
        this.pageSourceId = data.pageSourceId;
        this.configureInitGetPhotos();
      }
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

  photoPicked(photo: PhotoResponse) {
    this.pickedPhoto = photo;
    this.isCropperLoading = true;
  }

  onSelectFile(event: any): void {
    this.imageChangedEvent = event;
  }

  close(): void {
    this.toggleModal.next();
  }

  reset() {
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
    this.pickedPhoto = undefined;
    this.imageChangedEvent = null;
    this.photoBlob = undefined;
    this.uploadFileForm.reset();
  }

  confirm(): void {
    this.isPosting = true;
    const data = this.constructUpdateRequest();
    this.sendUpdateRequest(data);
  }

  private constructUpdateRequest(): FormData {
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

    return formData;
  }

  private sendUpdateRequest(data: FormData) {
    let updateFn: (data: FormData, id: number) => Observable<PhotoResponse>;
    let notifyUpdate$: Subject<{photo: PhotoResponse, pageId: number}>;
    let subject = '';

    if (this.updateType == 'AVATAR') {
      updateFn = this.profileService.uploadAvatar
      notifyUpdate$ = this.messageService.updateAvatar;
      subject = 'ảnh đại diện';
    }
    else {
      updateFn = this.profileService.uploadAvatar
      notifyUpdate$ = this.messageService.updateCoverPhoto;
      subject = 'ảnh bìa';
    }

    const updateSuccessFn = (photo: PhotoResponse) => {
      notifyUpdate$.next({
        photo: photo,
        pageId: this.pageToUpdateId
      });

      this.toaster.message$.next({
        type: ToasterMessageType.SUCCESS,
        message: `Thay ảnh ${subject} thành công`
      })
    }

    const updateErrorFn = () => {
      this.toaster.message$.next({
        type: ToasterMessageType.ERROR,
        message: `Đã có lỗi trong quá trình thay đổi ${subject}`
      })
    }

    updateFn.call(this.profileService, data, this.pageToUpdateId).subscribe(
      updateSuccessFn,
      updateErrorFn,
      () => {this.isPosting = false; this.close()}
    );
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

    return new Blob([ab], {type: 'image/jpeg'});
  }
}
