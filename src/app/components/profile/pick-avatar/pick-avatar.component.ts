import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Event } from '@angular/router';
import { MessageService } from '../../common/message.service';
import { PhotoViewResponse } from '../../common/photo/photo-view-response';
import { UserProfile } from '../user-profile';

@Component({
  selector: 'app-pick-avatar',
  templateUrl: './pick-avatar.component.html',
  styleUrls: ['./pick-avatar.component.scss']
})
export class PickAvatarComponent implements OnInit, OnDestroy {

  @Output() closeMe: EventEmitter<void> = new EventEmitter();

  updateType = '';
  photos!: PhotoViewResponse[];
  pickedPhoto!: PhotoViewResponse | undefined;
  uploadFileForm!: FormGroup;
  photoBlob: Blob | undefined;
  photoSizeRatio = 0;
  photoBlobUrl = '';
  userProfile!: UserProfile;
  isVisible = true;


  constructor(private http: HttpClient,
    private renderer: Renderer2,
    private messageService: MessageService) { }

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
      this.http.get<PhotoViewResponse[]>(`http://localhost:8080/api/profiles/${profile.id}/photos`)
          .subscribe(photos => {
            this.photos = photos;
          });
    }); 
  }

  photoPicked(photo: PhotoViewResponse): void {
    console.log('picke');
    
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
    let dest = `http://localhost:8080/api/profiles/${this.userProfile.id}/`;
    if (this.pickedPhoto) {
      if (this.updateType == 'avatar') {
        this.http.put(dest + 'update-avatar', this.pickedPhoto?.id).subscribe(_ => {
          this.messageService.updateAvatar.next(this.pickedPhoto?.url);
        })
      }
      else {
        this.http.put(dest + 'update-cover', this.pickedPhoto?.id).subscribe(_ => {
          this.messageService.updateCoverPhoto.next(this.pickedPhoto?.url);
        })
      }
    }
    else {
      let formData = new FormData();
      let photoRequest = new Blob([JSON.stringify({
        privacy: 'PUBLIC',
        sizeRatio: this.photoSizeRatio
      })], {type: 'application/json'});
      formData.append('photoRequest', photoRequest);

      formData.append('photo', this.photoBlob == undefined ? new Blob() : this.photoBlob);

      if (this.updateType == 'avatar') {
        this.http.put<PhotoViewResponse>(dest + 'upload-avatar', formData).subscribe(resp => {
          this.messageService.updateAvatar.next(resp.url);
        });
      }
      else {
        this.http.put<PhotoViewResponse>(dest + 'upload-cover', formData).subscribe(resp => {
          this.messageService.updateCoverPhoto.next(resp.url);
        });
      }
    }

    this.close();
  }

}
