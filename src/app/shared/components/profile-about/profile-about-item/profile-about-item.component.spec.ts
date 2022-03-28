import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileAboutItemComponent} from './profile-about-item.component';

describe('ProfileAboutItemComponent', () => {
  let component: ProfileAboutItemComponent;
  let fixture: ComponentFixture<ProfileAboutItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileAboutItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAboutItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
