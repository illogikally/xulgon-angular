import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../common/message.service';
import { UserDto } from '../../common/user-dto';
import { UserProfile } from '../user-profile';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit {

  friends!: UserDto[];
  friendsCopy!: UserDto[];
  @Input() profileId!: number | undefined;
  searchForm!: FormGroup;

  constructor(private http: HttpClient,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.messageService.onLoadPostsByPageId().subscribe(pageId => {
      if (pageId === undefined) return;
      this.http.get<UserDto[]>(`http://localhost:8080/api/profiles/${pageId}/friends`)
          .subscribe(resp => {
            this.friends = resp;
            this.friendsCopy =  this.friends;
          })
    })

    this.searchForm = new FormGroup({
      searchInput: new FormControl('')
    });

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
