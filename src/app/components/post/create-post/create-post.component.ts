import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ProfileService } from '../../profile/profile.service';
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
export class CreatePostComponent implements OnInit {

  @Input() open$!: Subject<any>;
  @Input() visible = false;

  @Input() groupName = '';
  @Input() groupId = NaN;
  @Input() groupPrivacy = '';
  @Input() sharedContent?: SharedContent;
  @Input() isHidden = true;

  @ViewChild('privacyBtn') privacyButton!: ElementRef;
  @ViewChild('textArea', {static: true}) textArea!: ElementRef;

  photos: any[] = [];
  files: Blob[] = [];
  postable: boolean = false;
  postForm: FormGroup;

  isPrivacyOptsVisible = false;
  isEmojiPickerHidden = true;

  isPosting = false;
  privacy = 'FRIEND';

  constructor(
    private self: ElementRef,
    private postService: PostService,
    private toasterService: ToasterService,
    private profileService: ProfileService,
    private renderer: Renderer2,
    private fb: FormBuilder,
    public authenticationService: AuthenticationService
  ) {
    this.postForm = this.fb.group({
      textarea: [''],
      fileInput: ['']
    });
  }

  ngOnInit(): void {
    this.open$.subscribe(() => {
      this.show();
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

        this.photos.push({
          url: event.target?.result as string,
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
    data = this.constructCreatePhotoRequest(data);
    data = this.constructCreatePostRequest(data);
    this.postService.createPost(data).subscribe(
      this.onCreatePostSuccess.bind(this),
      this.onCreatePostError.bind(this)
    );
  }

  onCreatePostSuccess(post: Post) {
      this.profileService.newPostCreated$.next(post);
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

  constructCreatePostRequest(data: FormData): FormData {
    this.privacy = this.groupPrivacy || this.privacy;
    const pageId = this.groupId || this.authenticationService.getProfileId();
    console.log(this.sharedContent?.id);
    
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

  constructCreatePhotoRequest(data: FormData): FormData {
    this.privacy = this.groupPrivacy || this.privacy;
    let photoRequests: any[] = []

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
    console.log(event);
    
    input!.setValue(input!.value + event.emoji.native);
  }

  clear() {
    this.photos = [];
    this.files = [];
    this.postForm.reset();
  }

  setPrivacy(privacy: string) {
    this.privacy = privacy;
    this.isPrivacyOptsVisible = false;
  }

  showPrivacyOpts(): void {

    console.log('hhehehe');
    this.isPrivacyOptsVisible = !this.isPrivacyOptsVisible;
  }

  clickOutsidePrivacyOpts() {
    this.isPrivacyOptsVisible = false;
  }

  abort() {
    this.files = [];
    this.photos = [];
  }

  show() {
    this.renderer.setStyle(this.self.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.self.nativeElement, 'top', '0px');
    this.renderer.setStyle(document.body, 'top', -window.scrollY + 'px');
    this.renderer.setStyle(document.body, 'position', 'fixed');
    this.textArea.nativeElement.focus();
  }

  hide() {
    const top = -parseInt(document.body.style.top);
    this.renderer.setStyle(this.self.nativeElement, 'display', 'none');
    this.renderer.removeStyle(document.body, 'position');
    window.scrollTo({top: top});
  }
}
