import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, HostListener, OnInit, Renderer2} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of, throwError, timer} from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../../common/user.service';
import {AuthenticationService} from '../authentication.service';
import {LoginRequest} from './login-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('slideInOutRight', [
      transition(':enter', [
        style({
          position: 'relative',
          transform: 'translateX(200%)',
          opacity: '0',
        }),
        animate(
          '.3s ease-in', 
          style({
            transform: 'translateX(0%)', 
            opacity: '1'
          })
        ),
      ]),
      transition(':leave', [
        style({
          position: 'absolute', 
          top: '0',
          opacity: '1'
        }),
        animate(
          '.3s ease-in', 
          style({
            transform: 'translateX(200%)',
            opacity: '0'
          })
        ),
      ])
    ]),
    trigger('slideInOutLeft', [
      transition(':enter', [
        style({
          position: 'relative',
          transform: 'translateX(-200%)',
          opacity: '0',
        }),
        animate(
          '.3s ease-in', 
          style({
            transform: 'translateX(0%)',
            opacity: '1',
          })
        ),
      ]),
      transition(':leave', [
        style({
          position: 'absolute', 
          top: '0',
          opacity: '1',
        }),
        animate('.3s ease-in', style({transform: 'translateX(-200%)', opacity: '0'})),
      ])
    ])
  ]
})
export class LoginComponent implements OnInit, AfterViewChecked {

  loginForm: FormGroup;
  registerForm: FormGroup;
  registerError: boolean | undefined;
  loginError = false;
  isLogin = false;
  disableAnimation = true;

  constructor(
    private renderer: Renderer2,
    private authService: AuthenticationService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: [
        '',
        [
          Validators.required, 
          Validators.pattern('[a-z]+'),
          Validators.minLength(6)
        ],
        this.userExisted.bind(this)
      ],
      password: [
        '', 
        [Validators.required, Validators.minLength(6)]
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '', 
        [Validators.required, Validators.email]
      ]
    })
  }

  private userExisted(
    control: AbstractControl
  ): Observable<ValidationErrors | null> | Promise<ValidationErrors | null> {
    return timer(300).pipe(
      switchMap(() => 
        this.userService.isUserExisted(control.value).pipe(
          map(isTaken => isTaken ? {userExisted: true} : null),
          catchError(() => of(null))
        )
      )
    )
  }

  calculateHeight(event: AnimationEvent) {
    if (event.toState === null) {
      const content = document.querySelector<HTMLElement>('.content');
      const container = document.querySelector<HTMLElement>('.fc-container');
      if (container) {
        const eventHeight = event.element.offsetHeight;
        this.renderer.setStyle(container, 'height', eventHeight + 100 + 'px');
        const height = eventHeight + 300 + 'px';
        this.renderer.setStyle(content, 'height', height);
      }
    }
  }

  discardHeight(event: AnimationEvent) {
    if (event.toState === null) {
      const container = document.querySelector<HTMLElement>('.fc-container');
      if (container) {
        this.renderer.setStyle(container, 'height', 'auto');
      }
    }
  }

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.router.navigateByUrl("/");
    }

    if (/login$/g.test(window.location.href)) {
      this.isLogin = true;
    }

  }

  ngAfterViewChecked(): void {
      
    this.disableAnimation = false;
  }

  @HostListener('window:popstate', [])
  onPopState(): void {
    if (this.authService.getToken()) {
      location.href = '/';
    }
  }

  register(): void {
    this.registerForm.markAllAsTouched();
    this.registerError = undefined;

    console.log(this.registerForm.get('username')?.errors);

    if (!this.registerForm.valid) {
      return;
    }


    let registerDto = {
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value,
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value
    };

    this.authService.register(registerDto)
      .subscribe(() => {
        this.registerError = false;
      }, () => {
        this.registerError = true;
      })
  }

  login(): void {
    this.loginForm.markAllAsTouched();
    this.loginError = false;

    if (!this.loginForm.valid) {
      return;
    }

    const loginRequest: LoginRequest = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value
    }

    this.authService.login(loginRequest)
      .subscribe(() => {
        this.loginError = false;
        location.href = '';
      }, () => {
        this.loginError = true;
      });
  }

  switchForm(event: any) {
    event.preventDefault();
    const container = document.querySelector<HTMLElement>('.fc-container');
    const height = container?.offsetHeight + 'px';
    this.renderer.setStyle(container, 'height', height);
    
    if (this.isLogin) {
      this.loginError = false;
      this.loginForm.reset()
      this.isLogin = false;
      this.location.go('/register');
    } else {
      this.registerError = undefined;
      this.registerForm.reset()
      this.isLogin = true;
      this.location.go('/login');
    }
  }

  validatorHasError(control: AbstractControl | null, error?: string): boolean {
    return !!(control?.touched && control?.hasError(error || '!$@@@9sxz#2S2@#$'));
  }
}
