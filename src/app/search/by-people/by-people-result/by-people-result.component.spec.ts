import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ByPeopleResultComponent} from './by-people-result.component';

describe('ByPeopleResultComponent', () => {
  let component: ByPeopleResultComponent;
  let fixture: ComponentFixture<ByPeopleResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ByPeopleResultComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ByPeopleResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
