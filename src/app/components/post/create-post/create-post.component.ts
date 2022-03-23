import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ProfileService } from '../../profile/profile.service';
import { PrincipalService } from '../../share/principal.service';
import { ToasterMessageType } from '../../share/toaster/toaster-message-type';
import { ToasterService } from '../../share/toaster/toaster.service';
import { Post } from '../post';
import { PostService } from '../post.service';
import { SharedContent } from '../shared-content';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit, AfterViewInit {

  @Input() width = '500px';

  @Input() groupName = '';
  @Input() groupId = NaN;
  @Input() groupPrivacy = '';
  @Input() sharedContent?: SharedContent;

  @Output() close = new EventEmitter();
  @ViewChild('privacyBtn') privacyButton!: ElementRef;
  @ViewChild('textArea', {static: true}) textArea!: ElementRef;

  photos: any[] = [];
  files: Blob[] = [];
  postable: boolean = false;
  postForm: FormGroup;

  isPrivacyOptsVisible = false;
  isEmojiPickerHidden = true;

  isPosting = false;
  privacy = this.storageService.retrieve('postPrivacy') || 'FRIEND';
  principalAvatarUrl = '';

  constructor(
    private self: ElementRef,
    private postService: PostService,
    private toasterService: ToasterService,
    private profileService: ProfileService,
    private renderer: Renderer2,
    private fb: FormBuilder,
    public authenticationService: AuthenticationService,
    private principalService: PrincipalService,
    private storageService: LocalStorageService

  ) {
    this.postForm = this.fb.group({
      textarea: [''],
      fileInput: ['']
    });
    this.principalService.getAvatarUrl().then(url => this.principalAvatarUrl = url);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setStyleHost();
  }

  setStyleHost() {
    this.renderer.setStyle(this.self.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.self.nativeElement, 'max-width', this.width);
  }

  onSelectImage(event: any): void {
    if (event.target?.files && event.target.files[0]) {
      this.files.push(event.target.files[0]);
      console.log(event);
      
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
        let img = new Image();
        const url = event.target?.result as string;
        img.src = url;

        this.photos.push({
          url: url
        });
      }
    }
  }

  textAreaAutoGrow(event: any) {
    event.target.style.height = 'auto';
    event.target.style.height = event.target.scrollHeight + "px";
  }

  submit(): void {
    this.isPosting = true;
    let data = new FormData();
    data = this.constructPhotoRequest(data);
    data = this.constructPostRequest(data);
    this.postService.createPost(data).subscribe(
      this.onCreatePostSuccess.bind(this),
      this.onCreatePostError.bind(this)
    );
  }

  onCreatePostSuccess(post: Post) {
      // this.profileService.newPostCreated$.next(post);
      this.isPosting = false;
      this.toasterService.message$.next({
        type: ToasterMessageType.SUCCESS,
        message: `Đăng bài thành công.`
      });
      this.clear();
      this.hide();
  }

  onCreatePostError() {
    this.isPosting = false;
    this.toasterService.message$.next({
      type: ToasterMessageType.ERROR,
      message: `Đã xảy ra lỗi khi đăng bài.`
    });
    this.clear();
    this.hide();
  }

  constructPostRequest(data: FormData): FormData {
    this.privacy = this.groupPrivacy || this.privacy;
    const pageId = this.groupId || this.authenticationService.getProfileId();

    let postRequest =  new Blob(
      [JSON.stringify({
        pageId: pageId,
        privacy: this.privacy,
        sharedContentId: this.sharedContent?.id,
        body: this.postForm.get('textarea')?.value
      })], 
      {type: 'application/json'}
    );

    data.append('postRequest', postRequest);
    return data;
  }

  constructPhotoRequest(data: FormData): FormData {
    this.privacy = this.groupPrivacy || this.privacy;
    let photoRequests: any[] = []
    this.photos.forEach(photo => {
    });
    this.files.forEach(file => {
      photoRequests.push({
        privacy: this.privacy, 
      });
      data.append('photos', file);
    });

    if (this.files.length == 0) {
      data.append('photos', new Blob([]));
    }

    let photoRequestBlob = new Blob(
      [JSON.stringify(photoRequests)],
      {type: 'application/json'}
    );
    data.append('photoRequest', photoRequestBlob);
    return data;
  }

  onEmojiSelect(event: any) {
    const input = this.postForm.get('textarea');
    input!.setValue(input!.value + event.emoji.native);
  }

  clear() {
    this.photos = [];
    this.files = [];
    this.postForm.reset();
    this.sharedContent = undefined;
  }

  setPrivacy(privacy: string) {
    this.privacy = privacy;
    this.storageService.store('postPrivacy', privacy);
    this.isPrivacyOptsVisible = false;
  }

  showPrivacyOpts(): void {
    this.isPrivacyOptsVisible = !this.isPrivacyOptsVisible;
  }

  clickOutsidePrivacyOpts() {
    this.isPrivacyOptsVisible = false;
  }

  abort() {
    this.files = [];
    this.photos = [];
  }
  
  hide() {
    this.close.emit();
    this.clear();
  }
}
