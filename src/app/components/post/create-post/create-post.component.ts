import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  photos: string[] = [];
  files: Blob[] = [];
  avatarUrl: string;
  username: string;
  postable: boolean = false;
  postForm!: FormGroup;

  @Output() closeMe: EventEmitter<void> = new EventEmitter();

  constructor(private http: HttpClient,
    private auth: AuthenticationService) { 
      this.avatarUrl = auth.getAvatarUrl();
      this.username = auth.getUserName();
  }

  ngOnInit(): void {
    console.log(this.auth.getAvatarUrl());
    
    this.postForm = new FormGroup({
      textarea: new FormControl(""),
      fileInput: new FormControl("")
    });
  }

  onSelectImage(event: any): void {
    if (event.target?.files && event.target.files[0]) {
      this.files.push(event.target.files[0]);
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        console.log(this.photos.push(event.target?.result as string));
      }
    }
  }
  
  autoGrow(event: any) {
    event.target.style.height = event.target.scrollHeight + "px";
  }

  submit(): void {
    let fd = new FormData();
    let postRequest = new Blob([JSON.stringify({
      pageId: this.auth.getProfileId(),
      privacy: 'PUBLIC',
      body: this.postForm.get('textarea')?.value,
    })], {type: 'application/json'});
    fd.append('postRequest', postRequest);
    // let photoRequest = new Blob([JSON.stringify([{ privacy: 'PUBLIC'}, {privacy:'PUBLIC'}])], {type: 'application/json'});

    let photoInfo: any[] = []
    this.files.forEach(file => {
      photoInfo.push({privacy: 'PUBLIC'});
      fd.append('photos', file);
    });
    if (this.files.length  == 0) {
      fd.append('photos', new Blob([]));
    }
    console.log(fd.get('photos'));
    
    let photoRequest = new Blob([JSON.stringify(photoInfo)], {type: 'application/json'});
    fd.append('photoRequest', photoRequest);
    this.http.post("http://localhost:8080/api/posts", fd).subscribe(big => console.log(big)); 
    console.log(this.auth.getProfileId());
    this.closeMe.emit();
  }

  closeSelf(): void {
    this.closeMe.emit();
  }
}
