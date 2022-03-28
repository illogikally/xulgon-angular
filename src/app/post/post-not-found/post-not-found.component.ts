import {Component, Input, OnInit} from '@angular/core';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-post-not-found',
  templateUrl: './post-not-found.component.html',
  styleUrls: ['./post-not-found.component.scss']
})
export class PostNotFoundComponent implements OnInit {

  @Input() size: 'small' | 'large' = 'large';
  @Input() isShare = false;
  environment = environment;

  constructor() { }

  ngOnInit(): void {
  }

}
