import {HttpClient} from '@angular/common/http';
import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AuthenticationService} from 'src/app/components/authentication/authentication.service';
import { PhotoResponse } from 'src/app/components/share/photo/photo-response';

@Component({
  selector: 'app-photo-list-item',
  templateUrl: './photo-list-item.component.html',
  styleUrls: ['./photo-list-item.component.scss']
})
export class PhotoListItemComponent implements OnInit {

  @Input() photo!: PhotoResponse;
  @Input() setId?: number;
  @Output() photoDeleted: EventEmitter<number> = new EventEmitter();
  loggedInUserId: number;
  isOptionsVisible: boolean = false;

  @ViewChild('optionsBtn') optionsBtn!: ElementRef;

  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) {
    this.loggedInUserId = authenticationService.getPrincipalId();
  }

  ngOnInit(): void {
  }

  showOptions(): void {
    this.isOptionsVisible = !this.isOptionsVisible;
  }

  hideOptions(event: any): void {

    let btnAndChildren = [...this.optionsBtn.nativeElement.children,
      this.optionsBtn.nativeElement];
    if (!btnAndChildren.includes(event.target)) {
      this.isOptionsVisible = false;
    }
  }

  deletePhoto(): void {
    this.http.delete(`http://localhost:8080/api/photos/${this.photo.id}`).subscribe(_ => {
      this.photoDeleted.emit(this.photo.id);
    });
  }

}
