import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByPostsComponent } from './by-posts.component';

describe('ByPostsComponent', () => {
  let component: ByPostsComponent;
  let fixture: ComponentFixture<ByPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ByPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
