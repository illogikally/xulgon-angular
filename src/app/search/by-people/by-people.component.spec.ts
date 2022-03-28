import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ByPeopleComponent} from './by-people.component';

describe('ByPeopleComponent', () => {
  let component: ByPeopleComponent;
  let fixture: ComponentFixture<ByPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ByPeopleComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ByPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
