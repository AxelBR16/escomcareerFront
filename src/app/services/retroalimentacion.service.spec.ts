import { TestBed } from '@angular/core/testing';

import { RetroalimentacionService } from './retroalimentacion.service';

describe('RetroalimentacionService', () => {
  let service: RetroalimentacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetroalimentacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
