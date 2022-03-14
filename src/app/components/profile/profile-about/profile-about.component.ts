import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile-about',
  templateUrl: './profile-about.component.html',
  styleUrls: ['./profile-about.component.scss']
})
export class ProfileAboutComponent implements OnInit {

  @Input() isTimeline = false;
  infos: any;
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
    this.getInfos();
    this.onUpdateListen();
    this.isProfileOwner = this.profileId == this.authenticationService.getProfileId(); 
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
        text: `Sinh ra tại ${this.infos?.hometown}`,
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
