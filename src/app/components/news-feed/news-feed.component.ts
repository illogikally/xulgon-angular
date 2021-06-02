import { HttpClient, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Post } from '../post/post';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss']
})
export class NewsFeedComponent implements OnInit {

  pageId: number;
  posts!: Post[];
  constructor(private auth: AuthenticationService,
    private http: HttpClient) {
    this.pageId = auth.getProfileId();
  }

  ngOnInit(): void {
    this.http.get<Post[]>(`http://localhost:8080/api/users/timeline`).subscribe(resp => {
      this.posts = resp;
    });
  }

}
