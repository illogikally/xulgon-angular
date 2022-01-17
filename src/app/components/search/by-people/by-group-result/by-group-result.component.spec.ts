import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ByGroupResultComponent} from './by-group-result.component';

describe('ByGroupResultComponent', () => {
  let component: ByGroupResultComponent;
  let fixture: ComponentFixture<ByGroupResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ByGroupResultComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ByGroupResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
