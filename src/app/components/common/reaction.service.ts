import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs';
import {ReactionPayload} from './reaction.payload';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  constructor(private http: HttpClient) {
  }

  react(reaction: ReactionPayload): Observable<any> {
    console.log(reaction);

    return this.http.post("http://localhost:8080/api/reactions", reaction);
  }

}
