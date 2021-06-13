import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRefAvatarComponent } from './user-ref-avatar.component';

describe('UserRefAvatarComponent', () => {
  let component: UserRefAvatarComponent;
  let fixture: ComponentFixture<UserRefAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRefAvatarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRefAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
