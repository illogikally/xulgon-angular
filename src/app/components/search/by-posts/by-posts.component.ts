import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../common/message.service';
import { Post } from '../../post/post';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-by-posts',
  templateUrl: './by-posts.component.html',
  styleUrls: ['./by-posts.component.scss']
})
export class ByPostsComponent implements OnInit {

  posts!: Post[];
  constructor(private message$: MessageService,
    private location: Location,
    private search$: SearchService) { }

  ngOnInit(): void {
    this.message$.generalSearch.subscribe(body => {
      if (!body) return;
      this.location.go("/search/posts?q=" + body);
      this.search$.byPost(body).subscribe(posts => {
        this.posts = posts; 
      });
    });
  }

}
