import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTimelineComponent } from './group-timeline.component';

describe('GroupTimelineComponent', () => {
  let component: GroupTimelineComponent;
  let fixture: ComponentFixture<GroupTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
