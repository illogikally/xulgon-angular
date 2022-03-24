import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {CreatePostComponent} from '../create-post/create-post.component';
import {PostService} from '../post.service';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss']
})
export class CreatePostModalComponent implements OnInit {

  toggleModalNgIf = new Subject<any>();
  data: any;

  @ViewChild(CreatePostComponent)
  createPostComponent!: CreatePostComponent;

  constructor(
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.configureOnOpenCalled();
  }

  configureOnOpenCalled() {
    this.postService.onOpenCreatePostCalled().subscribe(data => {
      this.data = data;
      this.toggleModalNgIf.next();
    });
  }

  clear() {
    this.createPostComponent.clear();
  }
}
