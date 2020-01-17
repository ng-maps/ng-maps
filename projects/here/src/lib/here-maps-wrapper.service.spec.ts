import { TestBed } from '@angular/core/testing';

import { HereMapsWrapperService } from './here-maps-wrapper.service';

describe('HereMapsWrapperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HereMapsWrapperService = TestBed.get(HereMapsWrapperService);
    expect(service).toBeTruthy();
  });
});
