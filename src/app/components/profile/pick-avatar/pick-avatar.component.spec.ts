import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickAvatarComponent } from './pick-avatar.component';

describe('PickAvatarComponent', () => {
  let component: PickAvatarComponent;
  let fixture: ComponentFixture<PickAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickAvatarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
