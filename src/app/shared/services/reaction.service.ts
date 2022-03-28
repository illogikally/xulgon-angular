import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs';
import {ReactionPayload} from '../models/reaction.payload';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) {
  }

  react(reaction: ReactionPayload): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/reactions`, reaction);
  }

}
