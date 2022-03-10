import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-not-found',
  templateUrl: './post-not-found.component.html',
  styleUrls: ['./post-not-found.component.scss']
})
export class PostNotFoundComponent implements OnInit {

  @Input() size: 'small' | 'large' = 'large';
  @Input() isShare = false;

  constructor() { }

  ngOnInit(): void {
  }

}
