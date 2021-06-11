import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MessageService } from '../../common/message.service';
import { UserProfile } from '../user-profile';

@Component({
  selector: 'app-profile-timeline',
  templateUrl: './profile-timeline.component.html',
  styleUrls: ['./profile-timeline.component.scss']
})
export class ProfileTimelineComponent implements OnInit {

  @Input() userProfile!: UserProfile;
  @Input() profileLoaded!: EventEmitter<UserProfile>;

  profileId!: number;
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.profileLoaded.subscribe(profile => {
      this.profileId = profile.id;
    });
    
    this.messageService.onProfileLoaded().subscribe(profile => {
      this.userProfile = profile;
    })
  }

}
