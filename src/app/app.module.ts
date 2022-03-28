import {CommonModule, ViewportScroller} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {CoreModule} from "./core/core.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthenticationModule} from "./authentication/authentication.module";
import {LoggedInModule} from "./logged-in/logged-in.module";

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
  ],
  imports: [
    CoreModule,
    // PostModule,
    // LoggedInModule,
    // AuthenticationModule,

    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private router: Router,
    private scroller: ViewportScroller,
  ) {
    let isNavigateSameRoute = true;
    let navigationTrigger = '';
    let scrollOnRouteReuse = true;
    this.router.events.subscribe(e  => {
      if (e instanceof NavigationStart) {
        if (router.url.replace(/\?.*$/g, '') == e.url.replace(/\?.*$/g, '')) {
          navigationTrigger = e.navigationTrigger || '';
          isNavigateSameRoute = true;
        } else {
          isNavigateSameRoute = false;
        }

      } else if (e instanceof NavigationEnd) {
        scrollOnRouteReuse =
          this.router.getCurrentNavigation()?.extras.state?.routeReuseScroll;

        if (!isNavigateSameRoute) {
          this.scroller.scrollToPosition([0, 0]);
        }

        else if (scrollOnRouteReuse !== false && navigationTrigger != 'popstate') {
          window.scrollTo({top: 0, behavior: 'smooth'});
        }
      }
    });
  }
}
