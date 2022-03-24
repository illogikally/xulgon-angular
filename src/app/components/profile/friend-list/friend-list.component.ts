import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {UserDto} from '../../share/user-dto';
import {ProfileService} from '../profile.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit {

  friends!: UserDto[];
  friendsCopy!: UserDto[];
  searchForm!: FormGroup;
  pageId!: number;
  isLoading = false;

  constructor(
    private profileSevice: ProfileService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.searchForm = new FormGroup({
      searchInput: new FormControl('')
    });

    this.configureOnSearch();
    this.getFriends();
  }

  getFriends() {
    let id = Number(this.activatedRoute.parent?.snapshot.paramMap.get('id'));
    if (id !== NaN) {
      this.isLoading = true;
      this.pageId = id;
      this.profileSevice.getProfileFriends(id) .subscribe(resp => {
        this.friends = resp;
        this.isLoading = false;
        this.friendsCopy = this.friends;
      });
    }
  }

  configureOnSearch() {
    this.searchForm.get('searchInput')?.valueChanges.subscribe(value => {
      this.friends = this.friendsCopy.filter(friend => {
        let name = friend.username.normalize("NFD")
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase();

        return name.includes(value.toLowerCase());
      });
    })
  }

  removeItem(userDto: UserDto): void {
    this.friends = this.friends.filter(user => user.id !== userDto.id);
  }
}
