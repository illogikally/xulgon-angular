import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-profile-about-item',
  templateUrl: './profile-about-item.component.html',
  styleUrls: ['./profile-about-item.component.scss']
})
export class ProfileAboutItemComponent implements OnInit {

  @Input() info = '';
  @Input() add = '';
  @Input() text = '';
  @Input() field = '';
  @Input() icon = '';
  @Input() label = '';
  @Input() isEditHidden = false;
  @Input() update!: Subject<any>;
  @Input() isProfileOwner = false;

  value = '';
  isFormHidden = true;
  constructor() { }

  @ViewChild('input') input!: ElementRef;
  ngOnInit(): void {
    this.value = this.info;
  }

  save() {
    this.value = this.input.nativeElement.value;
    this.update.next({
      field: this.field,
      value: this.value
    })
    this.isFormHidden = true;
  }

  abort() {
    this.isFormHidden = true;
  }

  showEdit() {
    this.isFormHidden = false;
    setTimeout(() => {
      this.input.nativeElement.focus();
      this.input.nativeElement.select();
    }, 0);
  }

}
