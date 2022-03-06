import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { concat, fromEvent, merge } from 'rxjs';
import textarea_caret from 'textarea-caret';
import { AuthenticationService } from '../../authentication/authentication.service';
import { PostService } from '../../post/post.service';
import { UserBasic } from '../user-basic';
import { UserService } from '../user.service';

@Component({
  selector: 'app-suggest-tag-user',
  templateUrl: './suggest-tag-user.component.html',
  styleUrls: ['./suggest-tag-user.component.scss']
})
export class SuggestTagUserComponent implements OnInit, AfterViewInit {

  @ViewChild('self') self!: ElementRef;
  @Input() input!: any;
  @Output() selected = new EventEmitter<UserBasic>();
  @Input() rootContentId!: number;

  candidates: UserBasic[] = [];
  itemIndex = 0;
  isSelecting = false;
  isInputFocus = false;
  isHidden = true;
  constructor(
    private userService: UserService,
    private postService: PostService,
    private renderer: Renderer2,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    fromEvent(this.input, 'keydown').subscribe((event: any) => {
      
      if (event.key == 'ArrowUp'){
        this.itemIndex = this.itemIndex == 0 ? 0 : this.itemIndex-1;
      }
      else if (event.key == 'ArrowDown') {
        this.itemIndex++;
      }
    });
    this.configureOnInputListener();
  }

  ngAfterViewInit(): void {
    this.configurePosition();
  }

  configurePosition() {
    const self = this.self.nativeElement;
    const caret = textarea_caret(this.input, this.input.selectionEnd || 0);
    this.renderer.setStyle(self, 'left', caret.left + 'px');
    this.renderer.setStyle(self, 'top', caret.top + 15 * 1.7 + 'px');
  }

  loadCandidates() {
    merge(
      this.userService.getFriends(this.authenticationService.getPrincipalId()),
      this.postService.getCommenters(this.rootContentId)
    ).subscribe(k => {
      this.candidates = this.candidates.concat(k)
    });
  }

  configureOnInputListener() {
    this.input.addEventListener('keydown', (event: any) => {
      if (event.key == '@') {
        this.show();
      }
    });
    this.input.addEventListener('input', (e: any) => {
      console.log(this.getQueryString());
    });
  }

  show() {
    this.isHidden = false;
    const caret = textarea_caret(this.input, this.input.selectionEnd);
    this.renderer.setStyle(this.self.nativeElement, 'left', caret.left + 'px');
    this.renderer.setStyle(this.self.nativeElement, 'top', caret.top + 15 * 1.7 + 'px');
  }

  hide() {
    this.itemIndex = 0;
    this.isHidden = true;
  }

  getQueryString(): string {
    const caretPosition = this.input.selectionStart;
    let index = caretPosition;
    const inputValue= this.input.value;
    while (index >= 0) {
      if (inputValue[index] == '@') {
        const match = inputValue.slice(index+1).match(/.*?(?=$|\s)/g);
        return match ? match[0] : '';
      }
      --index;
    }
    return '';
  }
}
