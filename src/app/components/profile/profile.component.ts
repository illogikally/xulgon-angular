import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileId: number;
  constructor(private activateRoute: ActivatedRoute) {
    this.profileId = this.activateRoute.snapshot.params.id;
  }

  ngOnInit(): void {
  }

}
