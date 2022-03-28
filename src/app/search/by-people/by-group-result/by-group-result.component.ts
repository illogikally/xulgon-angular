import {Component, Input, OnInit} from '@angular/core';
import {GroupResponse} from 'src/app/group/group-response';

@Component({
  selector: 'app-by-group-result',
  templateUrl: './by-group-result.component.html',
  styleUrls: ['./by-group-result.component.scss']
})
export class ByGroupResultComponent implements OnInit {

  @Input() result!: GroupResponse;

  constructor() {
  }

  ngOnInit(): void {
  }

}
