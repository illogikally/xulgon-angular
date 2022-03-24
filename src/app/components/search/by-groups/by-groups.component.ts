import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../share/message.service';
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

  constructor(
    private searchService: SearchService,
    private location: Location) {
  }

  ngOnInit(): void {
    this.searchService.search$.subscribe(name => {
      if (!name) return;
      this.location.go("/search/groups?q=" + name)
      this.searchService.byGroup(name).subscribe(results => {
        this.results = results;
        this.isLoaded = true;
      });
    })
  }

}
