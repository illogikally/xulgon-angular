import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinRequestItemComponent } from './join-request-item.component';

describe('JoinRequestItemComponent', () => {
  let component: JoinRequestItemComponent;
  let fixture: ComponentFixture<JoinRequestItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinRequestItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinRequestItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
