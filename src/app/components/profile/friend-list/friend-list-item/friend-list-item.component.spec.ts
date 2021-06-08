import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendListItemComponent } from './friend-list-item.component';

describe('FriendListItemComponent', () => {
  let component: FriendListItemComponent;
  let fixture: ComponentFixture<FriendListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
