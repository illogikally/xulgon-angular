import { TestBed } from '@angular/core/testing';

import { GroupAdminGuard } from './group-admin.guard';

describe('GroupAdminGuard', () => {
  let guard: GroupAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GroupAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
