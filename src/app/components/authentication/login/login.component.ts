import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component, HostListener, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {throwError} from 'rxjs';
import {AuthenticationService} from '../authentication.service';
import {LoginRequest} from './login-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  registerForm!: FormGroup;
  loginRequest: LoginRequest;
  loginError: boolean = false;
  isLogin = false;
  registerError: boolean | undefined;

  constructor(private auth$: AuthenticationService,
              private http: HttpClient,
              private location: Location,
              private router: Router) {
    this.loginRequest = {
      username: '',
      password: ''
    }
  }

  ngOnInit(): void {
    if (this.auth$.getToken()) {
      this.router.navigateByUrl("/");
    }

    if (/login/g.test(window.location.href)) {
      this.isLogin = true;
    }

    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })

    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      firstName: new FormControl('', [Validators.required,
        Validators.pattern('[a-zA-Z ]+')]),
      lastName: new FormControl('', Validators.required),
    });

  }

  @HostListener('window:popstate', [])
  onPopState(): void {
    if (this.auth$.getToken()) {
      location.href = '/';
    }
  }

  register(): void {
    let registerDto = {
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value,
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
    }

    this.http.post('http://localhost:8080/api/authentication/account/register', registerDto).subscribe(_ => {
      console.log('registered');
      this.registerError = false;

    }, error => {
      this.registerError = true;
    })
  }

  login(): void {
    console.log('login');

    this.loginRequest.username = this.loginForm.get('username')?.value;
    this.loginRequest.password = this.loginForm.get('password')?.value;

    this.auth$.login(this.loginRequest)
      .subscribe(_ => {
        this.loginError = false;
        location.href = '';
      }, error => {
        this.loginError = true;
        throwError(error);
      });
  }

  showLogin(event: any): void {
    event.preventDefault();
    this.isLogin = true;
    this.location.go('/login');
  }

  showRegister(event: any): void {
    event.preventDefault();
    this.isLogin = false;
    this.location.go('/register');
  }

}
