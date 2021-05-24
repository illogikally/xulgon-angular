import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { AuthenticationGuard } from './components/authentication/authentication.guard'

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', component: LoginComponent, canActivate: [AuthenticationGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
