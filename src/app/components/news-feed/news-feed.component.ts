import { NumberFormatStyle } from '@angular/common';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../authentication/authentication.service';
import { MessageService } from '../common/message.service';
import { Post } from '../post/post';
import { UserProfile } from '../profile/user-profile';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss']
})
export class NewsFeedComponent implements OnInit, OnDestroy {

  pageId: number;
  posts!: Post[];
  constructor(private auth$: AuthenticationService,
    private title: Title,
    private message$: MessageService,
    private http: HttpClient) {
    this.pageId = auth$.getProfileId();
  }

  isDestroyed = false;

  ngOnDestroy() {
  }

  ngOnInit(): void {
    this.title.setTitle('Xulgon');

    this.http.get<Post[]>(`http://localhost:8080/api/users/timeline`).subscribe(resp => {
      this.posts = resp;
    });
  }

}
