import { HttpClient } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../authentication/authentication.service';
import { MessageService } from '../../common/message.service';
import { Post } from '../post';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  photos: any[] = [];
  files: Blob[] = [];
  sizeRatio: number[] = []
  avatarUrl: string;
  username: string;
  postable: boolean = false;
  postForm!: FormGroup;

  @Output() closeMe: EventEmitter<void> = new EventEmitter();

  constructor(private http: HttpClient,
    private messageService: MessageService,
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
        let img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          this.sizeRatio.push(img.width / img.height);
        }

        this.photos.push({
          url: event.target?.result as string,
          sizeRatio: this.sizeRatio[this.sizeRatio.length-1]
        });
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
      body: this.postForm.get('textarea')?.value
    })], {type: 'application/json'});
    fd.append('postRequest', postRequest);

    let photoRequests: any[] = []
    this.files.forEach((v, i) => {
      photoRequests.push({privacy: 'PUBLIC', widthHeightRatio: this.sizeRatio[i]});
      fd.append('photos', v);
    });

    if (this.files.length == 0) {
      fd.append('photos', new Blob([]));
    }
    console.log(fd.get('photos'));
    
    let photoRequestBlob = new Blob([JSON.stringify(photoRequests)], {type: 'application/json'});
    fd.append('photoRequest', photoRequestBlob);
    this.http.post<Post>("http://localhost:8080/api/posts", fd).subscribe(resp => {
      this.messageService.sendCreatedPost(resp);
    }); 

    this.closeMe.emit();
  }

  closeSelf(): void {
    this.closeMe.emit();
  }
}
