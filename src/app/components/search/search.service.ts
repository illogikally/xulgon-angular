import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserDto} from '../common/user-dto';
import {GroupResponse} from '../group/group-response';
import {Post} from '../post/post';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchApi = 'http://localhost:8080/api/search/'

  constructor(private http: HttpClient) {
  }

  byPeople(name: string): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.searchApi + `people/${name}`);
  }

  byGroup(name: string): Observable<GroupResponse[]> {
    return this.http.get<GroupResponse[]>(this.searchApi + `groups/${name}`);
  }

  byPost(postBody: string): Observable<Post[]> {
    return this.http.get<Post[]>(this.searchApi + `posts/${postBody}`);
  }
}
