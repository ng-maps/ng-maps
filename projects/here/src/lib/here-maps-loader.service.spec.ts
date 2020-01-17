import { TestBed } from '@angular/core/testing';

import { HereMapsLoaderService } from './here-maps-loader.service';

describe('HereMapsLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HereMapsLoaderService = TestBed.get(HereMapsLoaderService);
    expect(service).toBeTruthy();
  });
});
