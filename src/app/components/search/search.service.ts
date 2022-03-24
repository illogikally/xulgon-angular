import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {GroupResponse} from '../group/group-response';
import {Post} from '../post/post';
import {OffsetResponse} from '../share/offset-response';
import {UserDto} from '../share/user-dto';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private baseApiUrl = environment.baseApiUrl;
  search$ = new ReplaySubject<string>(1);

  constructor(private http: HttpClient) {
  }

  byPeople(name: string): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.baseApiUrl + `/search/people/${name}`);
  }

  byGroup(name: string): Observable<GroupResponse[]> {
    return this.http.get<GroupResponse[]>(this.baseApiUrl + `/search/groups/${name}`);
  }

  byPost(postBody: string, size: number, offset: number): Observable<OffsetResponse<Post>> {
    const url = this.baseApiUrl + `/search/posts/${postBody}?size=${size}&offset=${offset}`;
    return this.http.get<OffsetResponse<Post>>(url);
  }
}
