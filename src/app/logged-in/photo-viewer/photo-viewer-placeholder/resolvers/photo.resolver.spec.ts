import { TestBed } from '@angular/core/testing';

import { PhotoResolver } from './photo.resolver';

describe('PhotoResolver', () => {
  let resolver: PhotoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PhotoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
