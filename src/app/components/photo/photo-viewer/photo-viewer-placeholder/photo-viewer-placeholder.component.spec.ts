import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoViewerPlaceholderComponent } from './photo-viewer-placeholder.component';

describe('PhotoViewerPlaceholderComponent', () => {
  let component: PhotoViewerPlaceholderComponent;
  let fixture: ComponentFixture<PhotoViewerPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoViewerPlaceholderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoViewerPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
