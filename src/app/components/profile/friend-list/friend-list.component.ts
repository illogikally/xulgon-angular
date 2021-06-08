import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserDto } from '../../common/user-dto';
import { UserProfile } from '../user-profile';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit {

  friends!: UserDto[];
  @Input() profileId!: UserProfile;
  searchForm!: FormGroup;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchInput: new FormControl('')
    });
    this.http.get<UserDto[]>(`http://localhost:8080/api/users/1/friends`)
        .subscribe(resp => {
          this.friends = resp;
        })
  }

  removeItem(userDto: UserDto): void {
    this.friends = this.friends.filter(user => user.id !== userDto.id);
  }
}
