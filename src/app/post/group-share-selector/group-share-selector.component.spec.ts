import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupShareSelectorComponent} from './group-share-selector.component';

describe('GroupShareSelectorComponent', () => {
  let component: GroupShareSelectorComponent;
  let fixture: ComponentFixture<GroupShareSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupShareSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupShareSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
