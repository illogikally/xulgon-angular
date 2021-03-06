import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {AuthenticationService} from '../../../core/authentication/authentication.service';
import {ProfileService} from '../../../profile/profile.service';

@Component({
  selector: 'app-profile-about',
  templateUrl: './profile-about.component.html',
  styleUrls: ['./profile-about.component.scss']
})
export class ProfileAboutComponent implements OnInit, OnChanges {

  @Input() isTimeline = false;
  @Input() isUserRefPopup = false;
  @Input() infos: any;
  fields: any[] = [];
  update = new Subject<any>();


  profileId!: number;
  isLoading = false;
  isProfileOwner = false;
  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    if (!this.isUserRefPopup) {
      this.getInfos();
      this.onUpdateListen();
    }
    this.isProfileOwner = this.profileId == this.authenticationService.getProfileId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.infos) {
      this.generateFields();
    }
  }

  onUpdateListen() {
    this.update.subscribe(data => {
      this.infos[data.field] = data.value;
      this.profileService.updateUserInfos(this.profileId, this.infos).subscribe(infos => {
        this.infos = infos;
        this.generateFields();
      });
    });

  }

  generateFields() {
    this.fields = [
      {
        title: 'Thêm nơi ở hiện tại',
        value: this.infos?.currentResidence,
        text: `Hiện đang sống ở ${this.infos?.currentResidence}`,
        icon: 'bx-current-location',
        label: 'Nơi ở hiện tại',
        field: 'currentResidence'
      },
      {
        title: 'Thêm nơi sinh',
        value: this.infos?.hometown,
        text: `Đến từ ${this.infos?.hometown}`,
        icon: 'bx-home',
        label: 'Nơi sinh',
        field: 'hometown'
      },
      {
        title: 'Thêm nơi học tập',
        value: this.infos?.school,
        text: `Học tại ${this.infos?.school}`,
        icon: 'bxs-graduation',
        label: 'Nơi học tập',
        field: 'school'
      },
      {
        title: 'Thêm nơi làm việc',
        value: this.infos?.workplace,
        text: `Làm việc tại ${this.infos?.workplace}`,
        icon: 'bxs-building-house',
        label: 'Nơi làm việc',
        field: 'workplace'
      },
      {
        title: 'Thêm tình trạng quan hệ',
        value: this.infos?.relationship,
        text: `Hiện đang ${this.infos?.relationship}`,
        icon: 'bxs-heart',
        label: 'Tình trạng quan hệ',
        field: 'relationship'
      }
    ]

    if (this.isUserRefPopup) {
      this.fields = this.fields.filter(f => f.value).slice(0, 2);
    }
  }

  getInfos() {
    this.isLoading = true;
    this.profileId = Number(this.route.snapshot.parent?.paramMap.get('id'));
    this.profileService.getInfos(this.profileId).subscribe(infos => {
      this.infos = infos;
      this.generateFields();
      this.isLoading = false;
    });
  }
}
