import { HttpClient, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { MessageService } from '../common/message.service';
import { Post } from '../post/post';
import { UserProfile } from '../profile/user-profile';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss']
})
export class NewsFeedComponent implements OnInit {

  pageId: number;
  posts!: Post[];
  constructor(private auth: AuthenticationService,
    private messageService: MessageService,
    private http: HttpClient) {
    this.pageId = auth.getProfileId();
  }

  ngOnInit(): void {
    this.messageService.sendLoadedProfile({} as UserProfile);
    this.http.get<Post[]>(`http://localhost:8080/api/users/timeline`).subscribe(resp => {
      this.posts = resp;
      console.log(this.posts);
      
    });
  }

}
