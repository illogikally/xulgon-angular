import {AnimationEvent} from '@angular/animations';
import {Location} from '@angular/common';
import {AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, of, timer} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {slideInOutLeft} from '../../shared/animations/slide-in-out-left.animation';
import {slideInOutRight} from '../../shared/animations/slide-in-out-right.animation';
import {UserService} from '../../shared/services/user.service';
import {AuthenticationService} from '../../core/authentication/authentication.service';
import {LoginRequest} from './login-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [slideInOutLeft, slideInOutRight]
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  registerError: boolean | undefined;
  loginError = false;
  isLogin = false;
  disableAnimation = true;
  isPosting = false;

  showSampleAccounts = false;
  @ViewChild('loginOuter') loginOuterElement!: ElementRef;
  @ViewChild('loginInner') loginInnerElement!: ElementRef;
  @ViewChild('loginTop') loginTopElement!: ElementRef;
  constructor(
    private renderer: Renderer2,
    private authService: AuthenticationService,
    private location: Location,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    const passwordPattern = '^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}$';
    const usernamePattern = '^(?![0-9])[a-z0-9]+';
    this.registerForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.pattern(usernamePattern), Validators.minLength(6)],
        this.userExisted.bind(this)
      ],
      password: [ '', [Validators.required, Validators.pattern(passwordPattern)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
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
      const inner = this.loginInnerElement.nativeElement;
      const outer = this.loginOuterElement.nativeElement;
      const top = this.loginTopElement.nativeElement;
      if (outer && inner) {
        const outerInnerGap = outer.offsetHeight - inner.offsetHeight;
        const eventHeight = event.element.offsetHeight;
        const innerHeight = eventHeight + top.offsetHeight;
        const outerHeight = innerHeight + outerInnerGap;
        this.renderer.setStyle(inner, 'height', innerHeight + 'px');
        this.renderer.setStyle(outer, 'height', outerHeight + 'px');
      }
    }
  }

  discardHeight(event: AnimationEvent) {
    if (event.toState === null) {
      const outer = this.loginOuterElement.nativeElement;
      const inner = this.loginInnerElement.nativeElement;
      this.renderer.setStyle(inner, 'height', 'auto');
      this.renderer.setStyle(outer, 'overflow', 'visible');
      this.renderer.setStyle(outer, 'height', 'auto');
    }
  }

  ngOnInit(): void {
    if (/login$/g.test(window.location.href)) {
      this.isLogin = true;
    }
  }

  ngAfterViewInit(): void {
    // Prevent ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.disableAnimation = false;
    }, 1);
  }

  @HostListener('window:popstate', [])
  onPopState(): void {
    if (this.authService.isLoggedIn()) {
      location.href = '/';
    }
  }

  register(): void {
    this.registerForm.markAllAsTouched();
    this.registerError = undefined;

    if (!this.registerForm.valid) {
      return;
    }
    this.isPosting = true;

    const registerDto = {
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value,
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value
    };

    this.authService.register(registerDto)
      .subscribe(() => {
        this.registerError = false;
        this.isPosting = false;
      }, () => {
        this.registerError = true;
        this.isPosting = false;
      })
    this.registerForm.reset();
  }

  login(): void {
    this.loginForm.markAllAsTouched();
    this.loginError = false;

    if (!this.loginForm.valid) {
      return;
    }

    this.isPosting = true;
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
        this.isPosting = false;
      });
  }

  switchForm(event: any) {
    event.preventDefault();
    const outer = this.loginOuterElement.nativeElement;
    const inner = this.loginInnerElement.nativeElement;
    this.renderer.setStyle(outer, 'height', outer.offsetHeight + 'px');
    this.renderer.setStyle(outer, 'overflow', 'hidden');
    this.renderer.setStyle(inner, 'height', inner.offsetHeight + 'px');

    if (this.isLogin) {
      this.loginError = false;
      this.loginForm.reset()
      this.isLogin = false;
      this.location.go('/register');
      this.showSampleAccounts = false;
    }
    else {
      this.registerError = undefined;
      this.registerForm.reset()
      this.isLogin = true;
      this.location.go('/login');
    }
  }

  validatorHasError(control: AbstractControl | null, error?: string): boolean {
    return !!(control?.touched && control?.hasError(error || '!$@@@9sxz#2S2@#$'));
  }

  googleLogin() {
    this.authService.oauthAuthorize('google');
  }
}
