import {RouterModule, Routes} from "@angular/router";
import {LoggedInService} from "../logged-in/logged-in.service";
import {NgModule} from "@angular/core";
import {PostViewComponent} from "./post-view.component";

const routes: Routes = [
  LoggedInService.withLoggedIn([
    { path: ':id/posts/:id', component: PostViewComponent},
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostViewRoutingModule { }
