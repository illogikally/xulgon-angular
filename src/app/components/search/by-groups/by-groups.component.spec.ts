import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByGroupsComponent } from './by-groups.component';

describe('ByGroupsComponent', () => {
  let component: ByGroupsComponent;
  let fixture: ComponentFixture<ByGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ByGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
