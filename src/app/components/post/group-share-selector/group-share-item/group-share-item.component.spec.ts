import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupShareItemComponent } from './group-share-item.component';

describe('GroupShareItemComponent', () => {
  let component: GroupShareItemComponent;
  let fixture: ComponentFixture<GroupShareItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupShareItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupShareItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
