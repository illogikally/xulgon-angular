import { TestBed } from '@angular/core/testing';

import { NotImplementedService } from './not-implemented.service';

describe('NotImplementedService', () => {
  let service: NotImplementedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotImplementedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
