import { TestBed } from '@angular/core/testing';

import { EepService } from './eep.service';

describe('EepService', () => {
  let service: EepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
