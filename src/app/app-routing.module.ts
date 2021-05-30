import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { AuthenticationGuard } from './components/authentication/authentication.guard'
import { HomeComponent } from './components/home/home.component'
import { NavbarComponent } from './components/navbar/navbar.component'
import { ProfileComponent } from './components/profile/profile.component';
import { CreatePostComponent } from './components/post/create-post/create-post.component'

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  // { path: '', component: HomeComponent, canActivate: [AuthenticationGuard]},
  { path: 'navbar', component: NavbarComponent},
  { path: 'create-post', component: CreatePostComponent},
  { path: ':id', component: ProfileComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
