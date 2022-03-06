import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestTagUserComponent } from './suggest-tag-user.component';

describe('SuggestTagUserComponent', () => {
  let component: SuggestTagUserComponent;
  let fixture: ComponentFixture<SuggestTagUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestTagUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestTagUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
