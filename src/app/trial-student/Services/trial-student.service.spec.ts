import { TestBed } from '@angular/core/testing';

import { TrialStudentService } from './trial-student.service';

describe('TrialStudentService', () => {
  let service: TrialStudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrialStudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
