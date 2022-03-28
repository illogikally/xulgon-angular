import {Component, OnInit} from '@angular/core';
import {GroupResponse} from '../../group/group-response';
import {SearchService} from '../search.service';

@Component({
  selector: 'app-by-groups',
  templateUrl: './by-groups.component.html',
  styleUrls: ['./by-groups.component.scss']
})
export class ByGroupsComponent implements OnInit {


  results: GroupResponse[] = [];
  isLoaded = false;
  isSearching = false;

  constructor(
    private searchService: SearchService,
  ) {
  }

  ngOnInit(): void {
    this.searchService.search$.subscribe(name => {
      if (!name) return;
      this.isLoaded = false;
      this.isSearching = true;
      this.results = [];
      this.searchService.byGroup(name).subscribe(results => {
        this.results = results;
        this.isSearching = false;
        this.isLoaded = true;
      });
    })
  }

}
