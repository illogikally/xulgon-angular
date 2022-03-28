import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ByPeopleComponent} from "./by-people/by-people.component";
import {SearchComponent} from "./search.component";
import {ByGroupsComponent} from "./by-groups/by-groups.component";
import {ByPostsComponent} from "./by-posts/by-posts.component";

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    children: [
      { path: '', redirectTo: 'people', pathMatch: 'full' },
      { path: 'people', component: ByPeopleComponent },
      { path: 'groups', component: ByGroupsComponent },
      { path: 'posts', component: ByPostsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
