import { TestBed } from '@angular/core/testing';

import { GoogleMapsLoaderService } from './google-maps-loader.service';

describe('GoogleMapsLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleMapsLoaderService = TestBed.get(
      GoogleMapsLoaderService,
    );
    expect(service).toBeTruthy();
  });
});
