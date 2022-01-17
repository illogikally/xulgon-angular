import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from '../common/message.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  constructor(private message$: MessageService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnDestroy() {
    this.message$.generalSearch.next('');
  }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      let q = params.get('q');
      if (!q) return;
      this.message$.generalSearch.next(q);
    });
  }

}
