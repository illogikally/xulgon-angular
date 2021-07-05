import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../common/message.service';
import { UserDto } from '../../common/user-dto';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-by-people',
  templateUrl: './by-people.component.html',
  styleUrls: ['./by-people.component.scss']
})
export class ByPeopleComponent implements OnInit {

  results!: UserDto[];
  constructor(private search$: SearchService,
    private message$: MessageService,
    private location: Location,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getResults();
  }

  getResults(): void {
    this.message$.generalSearch.subscribe(name => {
      if (!name) return;
      this.location.go(`/search/people?q=${name}`);
      this.search$.byPeople(name).subscribe(results => {
        console.log(results);
        
        this.results = results;
      });
    })
  }
}
