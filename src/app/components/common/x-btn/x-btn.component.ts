import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-x-btn',
  templateUrl: './x-btn.component.html',
  styleUrls: ['./x-btn.component.scss']
})
export class XBtnComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  hover() {
    console.log('hover');
    
  }

}
