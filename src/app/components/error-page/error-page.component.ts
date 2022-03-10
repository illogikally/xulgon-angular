import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../share/message.service';
import { ErrorPageService } from './error-page.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  isHidden = true;
  constructor(
    private errorPageService: ErrorPageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.data.displayErrorPage) {
      this.isHidden = false; 
    }
    else {
      this.errorPageService.onShowListen().subscribe(() => {
        this.isHidden = false;
      });

      this.router.events.subscribe(() => {
        this.isHidden = true;
      });
    }
  }
}
