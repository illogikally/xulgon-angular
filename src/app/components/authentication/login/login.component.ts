import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  loginRequest: LoginRequest;
  loginError: boolean = true;

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private toaster: ToastrService) { 
    this.loginRequest = {
      username: '',
      password: ''
    }
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  login(): void {
    this.loginRequest.username = this.loginForm.get('username')?.value;
    this.loginRequest.password = this.loginForm.get('password')?.value;
    console.log("user pwd", this.loginRequest);
    
    this.authenticationService.login(this.loginRequest)
      .subscribe(_ => {
        this.loginError = false;
        this.router.navigateByUrl('');
        this.toaster.success('Login successful');
      }, error => { 
        this.loginError = true;
        throwError(error);
    });
  }

}
