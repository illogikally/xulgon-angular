import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinRequestListComponent } from './join-request-list.component';

describe('JoinRequestListComponent', () => {
  let component: JoinRequestListComponent;
  let fixture: ComponentFixture<JoinRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
