import { TestBed } from '@angular/core/testing';

import { ProfileHeaderResolver } from './profile-header.resolver';

describe('ProfileHeaderResolver', () => {
  let resolver: ProfileHeaderResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ProfileHeaderResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
