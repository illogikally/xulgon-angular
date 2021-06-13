import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../authentication/authentication.service';
import { MessageService } from '../../common/message.service';
import { UserProfile } from '../user-profile';

@Component({
  selector: 'app-profile-timeline',
  templateUrl: './profile-timeline.component.html',
  styleUrls: ['./profile-timeline.component.scss']
})
export class ProfileTimelineComponent implements OnInit {

  @Input() userProfile!: UserProfile;
  loggedInUserId: number;

  constructor(private messageService: MessageService,
    private auth: AuthenticationService) {

      this.loggedInUserId = this.auth.getUserId();
    }

  ngOnInit(): void {
    
    this.messageService.onProfileLoaded().subscribe(profile => {
      this.userProfile = profile;
    })
  }

  updateSticky = new Subject<boolean>();

  updateMethod() {
    this.updateSticky.next(true);
  }

}
