import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-oauth2-callback',
  templateUrl: './oauth2-callback.component.html',
  styleUrls: ['./oauth2-callback.component.scss']
})
export class Oauth2CallbackComponent implements OnInit {

  constructor(
    private router: Router,
    private auth$: AuthenticationService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.queryParamMap;
    const code = params.get('code');
    const state = params.get('state');
    const provider = params.get('provider');
    console.log(params);
    
    if (code && state && provider) {
      this.auth$.oauth2(code, state, provider)
        .subscribe(_ => {
          console.log('bing chilling');
          
        });
    }

  }
}
