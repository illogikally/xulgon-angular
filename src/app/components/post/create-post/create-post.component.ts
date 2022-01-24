import {HttpClient} from '@angular/common/http';
import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MessageService} from '../../common/message.service';
import {GroupResponse} from '../../group/group-response';
import {Post} from '../post';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnDestroy, OnInit {

  photos: any[] = [];
  files: Blob[] = [];
  sizeRatios: number[] = []
  avatarUrl: string;
  userFullName: string
  postable: boolean = false;
  postForm!: FormGroup;
  isPrivacyOptsVisible = false;
  privacy = 'FRIEND';

  textAreaDefaultHeight!: number;

  @Input() groupResponse!: GroupResponse;

  @Output() closeMe: EventEmitter<void> = new EventEmitter();

  @ViewChild('privacyBtn') privacyBtn!: ElementRef;
  @ViewChild('textArea', {static: true}) textArea!: ElementRef;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) {
    this.avatarUrl = authService.getAvatarUrl();
    this.userFullName = authService.getUserFullName() as string;

  }

  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'position', 'relative');
  }

  ngOnInit(): void {
    this.renderer.setStyle(document.body, 'position', 'fixed');

    this.textAreaDefaultHeight = this.textArea.nativeElement.style.height;
    this.postForm = this.fb.group({
      textarea: [''],
      fileInput: ['']
    });
  }

  onSelectImage(event: any): void {
    if (event.target?.files && event.target.files[0]) {
      this.files.push(event.target.files[0]);
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
        let img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          this.sizeRatios.push(img.width / img.height);
        }

        this.photos.push({
          url: event.target?.result as string,
          sizeRatio: this.sizeRatios[this.sizeRatios.length - 1]
        });
      }
    }
  }

  autoGrow(event: any) {
    console.log('values changed');
    event.target.style.height = 'auto';
    event.target.style.height = event.target.scrollHeight + "px";
  }

  submit(): void {
    let formData = new FormData();

    const targetPage = this.groupResponse ?
      this.groupResponse.id : this.authService.getProfileId();

    this.privacy = !this.groupResponse ? this.privacy 
      : this.groupResponse.isPrivate ? 'GROUP' : 'PUBLIC';

    let postRequest = new Blob([JSON.stringify({
      pageId: targetPage,
      privacy: this.privacy,
      body: this.postForm.get('textarea')?.value
    })], {type: 'application/json'});
    formData.append('postRequest', postRequest);

    let photoRequests: any[] = []
    this.files.forEach((v, i) => {
      photoRequests.push({privacy: this.privacy, widthHeightRatio: this.sizeRatios[i]});
      formData.append('photos', v);
    });

    if (this.files.length == 0) {
      formData.append('photos', new Blob([]));
    }
    console.log(formData.get('photos'));

    let photoRequestBlob = new Blob([JSON.stringify(photoRequests)], {type: 'application/json'});
    formData.append('photoRequest', photoRequestBlob);
    this.http.post<Post>("http://localhost:8080/api/posts", formData).subscribe(resp => {
      this.messageService.sendCreatedPost(resp);
    });

    this.closeMe.emit();
  }

  closeSelf(): void {
    this.closeMe.emit();
  }

  setPrivacy(privacy: string): void {
    this.privacy = privacy;
    this.isPrivacyOptsVisible = false;
  }

  showPrivacyOpts(): void {
    this.isPrivacyOptsVisible = !this.isPrivacyOptsVisible;
  }

  clickOutsidePrivacyOpts(): void {
    this.isPrivacyOptsVisible = false;
  }

  abort(): void {
    this.files = [];
    this.sizeRatios = [];
    this.photos = [];
  }
}
