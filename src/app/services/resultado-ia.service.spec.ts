import { TestBed } from '@angular/core/testing';

import { ResultadoIAService } from './resultado-ia.service';

describe('ResultadoIAService', () => {
  let service: ResultadoIAService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultadoIAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
