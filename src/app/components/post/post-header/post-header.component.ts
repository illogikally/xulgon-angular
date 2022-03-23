import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-header',
  templateUrl: './post-header.component.html',
  styleUrls: ['./post-header.component.scss']
})
export class PostHeaderComponent implements OnInit {

  @Input() content!: any;
  @Input() isPageNameVisible = false;
  @Input() isAvatarVisible = true;
  @Input() textOnly = false;

  contentUrl = '';
  constructor() { }

  ngOnInit(): void {
    this.contentUrl = this.createContentUrl();
  }

  createContentUrl(): string {
    const isGroupPost = this.content.pageType == 'GROUP';
    const isPost = this.content.type == 'POST';
    return isPost 
      ? `${isGroupPost ? '/groups' : ''}/${this.content.pageId}/posts/${this.content.id}`
      : `/photo/${this.content.id}`;
  }

}
