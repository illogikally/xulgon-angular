import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupGeneralGroupItemComponent} from './group-general-group-item.component';

describe('GroupGeneralGroupItemComponent', () => {
  let component: GroupGeneralGroupItemComponent;
  let fixture: ComponentFixture<GroupGeneralGroupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupGeneralGroupItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupGeneralGroupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
