import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  photos: string[] = [];
  files: Blob[] = [];
  postable: boolean = false;
  postForm!: FormGroup;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
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
      pageId: 1,
      privacy: 'PUBLIC',
      body: "Yhorm the Giant is a Lord of Cinder and boss enemy in Dark Souls 3. He is known as the 'reclusive lord of the Profaned Capital'. Yhorm is the descendant of an ancient conqueror, but was asked by the very people once subjugated to lead them. In the past, he was a skilled Giant combatant, powerful enough to become a lord of a city and a Lord of Cinder.",
    })], {type: 'application/json'});
    let photoRequest = new Blob([JSON.stringify([{ privacy: 'PUBLIC'}, {privacy:'PUBLIC'}])], {type: 'application/json'});
    fd.append('postRequest', postRequest);
    fd.append('postRequest', postRequest);
    fd.append('photoRequest', photoRequest);

    this.files.forEach(file => {
      fd.append('photos', file);
    });
    this.http.post("http://localhost:8080/api/posts", fd).subscribe(big => console.log(big)); 
    console.log("submitted");
    
    
  }
}
