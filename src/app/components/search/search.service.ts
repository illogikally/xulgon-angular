import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserDto} from '../share/user-dto';
import {GroupResponse} from '../group/group-response';
import {Post} from '../post/post';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) {
  }

  byPeople(name: string): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.baseApiUrl + `/search/people/${name}`);
  }

  byGroup(name: string): Observable<GroupResponse[]> {
    return this.http.get<GroupResponse[]>(this.baseApiUrl + `/search/groups/${name}`);
  }

  byPost(postBody: string): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseApiUrl + `/search/posts/${postBody}`);
  }
}
