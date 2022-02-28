import {HttpClient} from '@angular/common/http';
import {Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MessageService} from '../../share/message.service';
import { PhotoResponse } from '../../share/photo/photo-response';
import {PhotoViewResponse} from '../../share/photo/photo-view-response';
import { PhotoService } from '../../share/photo/photo.service';
import { ProfileService } from '../profile.service';
import {UserPage} from '../user-profile';

@Component({
  selector: 'app-pick-avatar',
  templateUrl: './pick-avatar.component.html',
  styleUrls: ['./pick-avatar.component.scss']
})
export class PickAvatarComponent implements OnInit, OnDestroy {

  @Output() closeMe: EventEmitter<void> = new EventEmitter();

  updateType = '';
  photos!: PhotoResponse[];
  pickedPhoto!: PhotoResponse | undefined;
  uploadFileForm!: FormGroup;
  photoBlob: Blob | undefined;
  photoSizeRatio = 0;
  photoBlobUrl = '';
  userProfile!: UserPage;
  isVisible = true;


  constructor(
    private renderer: Renderer2,
    private profileService: ProfileService,
    private photoService: PhotoService,
    private messageService: MessageService
  ) {
  }

  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'position', 'relative');
  }

  ngOnInit(): void {
    this.renderer.setStyle(document.body, 'position', 'fixed');
    this.uploadFileForm = new FormGroup({
      fileInput: new FormControl('')
    });

    this.messageService.updateAvatarOrCover.subscribe(msg => {
      if (msg == 'avatar') {
        this.updateType = 'avatar';
      }

      if (msg == 'cover') {
        this.updateType = 'cover';
      }
    });

    this.messageService.onProfileLoaded().subscribe(profile => {
      this.userProfile = profile;
      this.photoService.getPagePhotos(profile.id).subscribe(photos => {
        this.photos = photos;
      });
    });
  }

  photoPicked(photo: PhotoResponse): void {
    this.pickedPhoto = photo;
  }

  onSelectFile(event: any): void {
    if (event.target?.files && event.target.files[0]) {
      this.photoBlob = event.target.files[0];
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
        let img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          this.photoSizeRatio = img.width / img.height;
        }

        this.photoBlobUrl = event.target?.result as string;
      }
    }
  }

  close(): void {
    this.closeMe.emit();
  }

  abort(): void {
    this.pickedPhoto = undefined;
    this.photoBlobUrl = '';
    this.photoBlob = undefined;
    this.photoSizeRatio = 0;
  }

  confirm(): void {
    if (this.pickedPhoto) {
      if (this.updateType == 'avatar') {
        this.profileService.updateAvatar(this.pickedPhoto.id).subscribe(() => {
          this.messageService.updateAvatar.next(this.pickedPhoto);
        });
      } else {
        this.profileService.updateCoverPhoto(this.pickedPhoto.id).subscribe(() => {
          this.messageService.updateCoverPhoto.next(this.pickedPhoto);
        }); 
      }
    } else {
      let formData = new FormData();
      let photoRequest = new Blob([JSON.stringify({
        privacy: 'PUBLIC',
        pageId: this.userProfile.id
      })], {type: 'application/json'});
      formData.append('photoRequest', photoRequest);

      formData.append('photo', this.photoBlob == undefined ? new Blob() : this.photoBlob);

      if (this.updateType == 'avatar') {
        this.profileService.uploadAvatar(formData).subscribe(photo => {
          this.messageService.updateAvatar.next(photo);
        });
      } else {
        this.profileService.uploadCoverPhoto(formData).subscribe(photo => {
          this.messageService.updateCoverPhoto.next(photo);
        });
      }
    }

    this.close();
  }

}
