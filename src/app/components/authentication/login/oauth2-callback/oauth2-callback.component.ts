import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-oauth2-callback',
  template: '',
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
    
    if (code && state && provider) {
      this.auth$.oauth2Login(code, state, provider)
        .subscribe(_ => {
          window.location.href = '';
        });
    }

  }
}
