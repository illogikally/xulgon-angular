import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupMemberItemComponent} from './group-member-item.component';

describe('GroupMemberItemComponent', () => {
  let component: GroupMemberItemComponent;
  let fixture: ComponentFixture<GroupMemberItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupMemberItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMemberItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
