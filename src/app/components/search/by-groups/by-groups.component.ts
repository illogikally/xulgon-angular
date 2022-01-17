import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../common/message.service';
import {GroupResponse} from '../../group/group-response';
import {SearchService} from '../search.service';

@Component({
  selector: 'app-by-groups',
  templateUrl: './by-groups.component.html',
  styleUrls: ['./by-groups.component.scss']
})
export class ByGroupsComponent implements OnInit {


  results!: GroupResponse[];

  constructor(private message$: MessageService,
              private search$: SearchService,
              private location: Location) {
  }

  ngOnInit(): void {
    this.message$.generalSearch.subscribe(name => {
      if (!name) return;
      this.location.go("/search/groups?q=" + name)
      this.search$.byGroup(name).subscribe(results => {

        this.results = results;
      });
    })
  }

}
