import { TestBed } from '@angular/core/testing';

import { HereMapsFitBoundsService } from './here-maps-fit-bounds.service';

describe('HereMapsFitBoundsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HereMapsFitBoundsService = TestBed.get(
      HereMapsFitBoundsService,
    );
    expect(service).toBeTruthy();
  });
});
