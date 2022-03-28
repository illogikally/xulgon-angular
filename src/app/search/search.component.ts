import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SearchService} from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  currentQuery = '';
  constructor(
    private searchService: SearchService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnDestroy() {
  }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      let q = params.get('q');
      if (!q || q == this.currentQuery) return;
      this.searchService.search$.next(q);
    });
  }

}
