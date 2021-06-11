import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Event } from '@angular/router';
import { MessageService } from '../../common/message.service';
import { PhotoResponse } from '../../common/photo/photo-response';
import { UserProfile } from '../user-profile';

@Component({
  selector: 'app-pick-avatar',
  templateUrl: './pick-avatar.component.html',
  styleUrls: ['./pick-avatar.component.scss']
})
export class PickAvatarComponent implements OnInit {

  @Output() closeMe: EventEmitter<void> = new EventEmitter();

  updateType = '';
  photos!: PhotoResponse[];
  pickedPhoto!: PhotoResponse | undefined;
  uploadFileForm!: FormGroup;
  photoBlob: Blob | undefined;
  photoSizeRatio = 0;
  photoBlobUrl = '';
  userProfile!: UserProfile;
  isVisible = true;


  constructor(private http: HttpClient,
    private messageService: MessageService) { }

  ngOnInit(): void {
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
      this.http.get<PhotoResponse[]>(`http://localhost:8080/api/profiles/${profile.id}/photos`)
          .subscribe(photos => {
            this.photos = photos;
          });
    }); 
  }

  photoPicked(photo: PhotoResponse): void {
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
        this.http.put<PhotoResponse>(dest + 'upload-avatar', formData).subscribe(resp => {
          this.messageService.updateAvatar.next(resp.url);
        });
      }
      else {
        this.http.put<PhotoResponse>(dest + 'upload-cover', formData).subscribe(resp => {
          this.messageService.updateCoverPhoto.next(resp.url);
        });
      }
    }
    // if (this.updateType == 'avatar') {
    //   if (this.pickedPhoto) {
    //     this.http.put(`http://localhost:8080/api/profiles/${this.userProfile.id}/update-avatar`, this.pickedPhoto?.id)
    //         .subscribe(_ => {
    //           this.messageService.updateAvatar.next(this.pickedPhoto?.url);
    //         });

    //     return;
    //   }
    //   else {

    //     this.http.put<PhotoResponse>(`http://localhost:8080/api/profiles/${this.userProfile.id}/upload-avatar`, formData).subscribe(
    //       resp => {
    //         this.messageService.updateAvatar.next(resp.url);
    //       }
    //     );
    //   }

    // }
    // else {
    //   if (this.pickedPhoto) {
    //     this.http.put(`http://localhost:8080/api/profiles/${this.userProfile.id}/update-avatar`, this.pickedPhoto?.id)
    //         .subscribe(_ => {
    //           this.messageService.updateAvatar.next(this.pickedPhoto?.url);
    //         });

    //     return;
    //   }
    //   else {

    //     let formData = new FormData();
    //     let photoRequest = new Blob([JSON.stringify({
    //       privacy: 'PUBLIC',
    //       sizeRatio: this.photoSizeRatio
    //     })], {type: 'application/json'});
    //     formData.append('photoRequest', photoRequest);

    //     formData.append('photo', this.photoBlob == undefined ? new Blob() : this.photoBlob);
    //     this.http.put<PhotoResponse>(`http://localhost:8080/api/profiles/${this.userProfile.id}/upload-avatar`, formData).subscribe(
    //       resp => {
    //         this.messageService.updateAvatar.next(resp.url);
    //       }
    //     );
    //   }

    // }

    this.close();
  }

}
