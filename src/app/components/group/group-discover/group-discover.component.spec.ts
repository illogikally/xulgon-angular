import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupDiscoverComponent} from './group-discover.component';

describe('GroupDiscoverComponent', () => {
  let component: GroupDiscoverComponent;
  let fixture: ComponentFixture<GroupDiscoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupDiscoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
