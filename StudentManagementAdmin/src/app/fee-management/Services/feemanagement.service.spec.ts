import { TestBed } from '@angular/core/testing';

import { FeemanagementService } from './feemanagement.service';

describe('FeemanagementService', () => {
  let service: FeemanagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeemanagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
