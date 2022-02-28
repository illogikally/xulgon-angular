import {HttpClient} from '@angular/common/http';
import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MessageService} from '../../share/message.service';
import {GroupResponse} from '../../group/group-response';
import {Post} from '../post';
import { Observable, Subject } from 'rxjs';
import { PostService } from '../post.service';
import { ProfileService } from '../../profile/profile.service';
import { ToasterService } from '../../share/toaster/toaster.service';
import { ToasterMessageType } from '../../share/toaster/toaster-message-type';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  photos: any[] = [];
  files: Blob[] = [];
  postable: boolean = false;
  postForm!: FormGroup;
  isPrivacyOptsVisible = false;

  isPosting = false;
  privacy = 'FRIEND';

  textAreaDefaultHeight!: number;

  @Input() groupResponse!: GroupResponse;
  @Input() open$!: Subject<any>;
  @Input() visible = false;

  @ViewChild('privacyBtn') privacyBtn!: ElementRef;
  @ViewChild('textArea', {static: true}) textArea!: ElementRef;

  constructor(
    private self: ElementRef,
    private postService: PostService,
    private toasterService: ToasterService,
    private profileService: ProfileService,
    private renderer: Renderer2,
    private fb: FormBuilder,
    public authenticationService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.textAreaDefaultHeight = this.textArea.nativeElement.style.height;
    this.postForm = this.fb.group({
      textarea: [''],
      fileInput: ['']
    });

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

  autoGrow(event: any) {
    event.target.style.height = 'auto';
    event.target.style.height = event.target.scrollHeight + "px";
  }

  submit(): void {
    this.isPosting = true;
    let data = new FormData();

    const targetPage = 
      this.groupResponse 
      ? this.groupResponse.id 
      : this.authenticationService.getProfileId();

    this.privacy = 
      !this.groupResponse 
      ? this.privacy
      : this.groupResponse.isPrivate 
        ? 'GROUP' 
        : 'PUBLIC';

    let postRequest = new Blob([JSON.stringify({
      pageId: targetPage,
      privacy: this.privacy,
      body: this.postForm.get('textarea')?.value
    })], {type: 'application/json'});
    data.append('postRequest', postRequest);

    let photoRequests: any[] = []
    this.files.forEach((v, i) => {
      photoRequests.push({
        privacy: this.privacy, 
      });
      data.append('photos', v);
    });

    if (this.files.length == 0) {
      data.append('photos', new Blob([]));
    }

    let photoRequestBlob = new Blob(
      [JSON.stringify(photoRequests)],
      {type: 'application/json'}
    );

    data.append('photoRequest', photoRequestBlob);

    this.postService.createPost(data).subscribe(post => {
      this.profileService.onPostCreate$.next(post);
      this.isPosting = false;
      this.toasterService.message$.next({
        type: ToasterMessageType.SUCCESS,
        message: `Đăng bài thành công.`
      });
      this.clear();
      this.hide();
    }, error => {
      this.isPosting = false;
      this.toasterService.message$.next({
        type: ToasterMessageType.ERROR,
        message: `Đã xảy ra lỗi khi đăng bài.`
      });
      this.clear();
      this.hide();
    });
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
    this.renderer.setStyle(this.self.nativeElement, 'visibility', 'visible');
    this.renderer.setStyle(this.self.nativeElement, 'top', '0px');
    this.renderer.setStyle(document.body, 'top', -window.scrollY + 'px');
    this.renderer.setStyle(document.body, 'position', 'fixed');
  }

  hide() {
    const top = -parseInt(document.body.style.top);
    this.renderer.setStyle(this.self.nativeElement, 'visibility', 'hidden');
    this.renderer.removeStyle(document.body, 'position');
    window.scrollTo({top: top});
  }
}
