import { Component, Input, OnInit } from '@angular/core';
import { UserDto } from 'src/app/components/common/user-dto';

@Component({
  selector: 'app-by-people-result',
  templateUrl: './by-people-result.component.html',
  styleUrls: ['./by-people-result.component.scss']
})
export class ByPeopleResultComponent implements OnInit {

  @Input() result!: UserDto;

  constructor() { }

  ngOnInit(): void {
  }

}
