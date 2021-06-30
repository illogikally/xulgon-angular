import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { LoginRequest } from './login-request';

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

  constructor(private authenticationService: AuthenticationService,
    private http: HttpClient,
    private location: Location,
    private router: Router ){
    this.loginRequest = {
      username: '',
      password: ''
    }
  }

  ngOnInit(): void {
    console.log(window.location.href);
    
    if (/login/g.test(window.location.href)) {
      this.isLogin = true;
    }

    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })

    this.registerForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
    });

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
    
    this.authenticationService.login(this.loginRequest)
      .subscribe(_ => {
        this.loginError = false;
        console.log('heh');
        this.router.navigateByUrl('');
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
