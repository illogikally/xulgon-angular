import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {UserDto} from '../../share/user-dto';
import {SearchService} from '../search.service';

@Component({
  selector: 'app-by-people',
  templateUrl: './by-people.component.html',
  styleUrls: ['./by-people.component.scss']
})
export class ByPeopleComponent implements OnInit {

  results: UserDto[] = [];
  isLoaded = false;
  isSearching = false;

  constructor(
    private searchService: SearchService,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    this.getResults();
  }

  getResults(): void {
    this.searchService.search$.subscribe(name => {
      if (!name) return;
      this.isSearching = true;
      this.isLoaded = false;
      this.results = [];
      this.searchService.byPeople(name).subscribe(results => {
        this.results = results;
        this.isSearching = false;
        this.isLoaded = true;
      });
    })
  }
}
