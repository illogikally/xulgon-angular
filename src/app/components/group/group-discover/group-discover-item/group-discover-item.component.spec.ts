import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupDiscoverItemComponent} from './group-discover-item.component';

describe('GroupDiscoverItemComponent', () => {
  let component: GroupDiscoverItemComponent;
  let fixture: ComponentFixture<GroupDiscoverItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupDiscoverItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDiscoverItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
