import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  searchForm: FormGroup;
  constructor() { 
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  ngOnInit(): void {
  }

}
