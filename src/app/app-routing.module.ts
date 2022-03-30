import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./authentication/login/login.component";
import {LoginGuard} from "./authentication/login/login.guard";
import {Oauth2CallbackComponent} from "./authentication/oauth2-callback/oauth2-callback.component";
import {LoggedInComponent} from "./logged-in/logged-in.component";
import {AuthenticationGuard} from "./core/authentication/authentication.guard";
import {
  PhotoViewerPlaceholderComponent
} from "./logged-in/photo-viewer/photo-viewer-placeholder/photo-viewer-placeholder.component";
import {PostViewComponent} from "./post-view/post-view.component";
import {ErrorPageComponent} from "./error-page/error-page.component";
import {NgModule} from "@angular/core";
import {CustomPreloadingStrategy} from "./core/route/custom-preloading-strategy";
import { PhotoResolver } from './logged-in/photo-viewer/photo-viewer-placeholder/resolvers/photo.resolver';

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  {path: 'register', component: LoginComponent, canActivate: [LoginGuard]},
  {path: 'oauth2/callback', component: Oauth2CallbackComponent},
  {
    path: '',
    component: LoggedInComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {path: '', loadChildren: () => import('./news-feed/news-feed.module').then(m => m.NewsFeedModule)},
      {
        path: 'friends',
        loadChildren: () => import('./friend-request/friend-request.module').then(m => m.FriendRequestModule),
        data: {preload: true, delay: 2000}
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
      },
      {path: 'photo/:id', component: PhotoViewerPlaceholderComponent, resolve: {photo: PhotoResolver}},
      {
        path: 'groups',
        loadChildren: () => import('./group/group.module').then(m => m.GroupModule),
        data: {preload: true, delay: 2000} 
      },
      // {path: ':id/posts/:id', component: PostViewComponent, pathMatch: 'full'},
      {
        path: ':id',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
        data: {preload: true, delay: 2000}
      },
      {path: '**', component: ErrorPageComponent, data: {displayErrorPage: true}}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'disabled',
      preloadingStrategy: CustomPreloadingStrategy
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
