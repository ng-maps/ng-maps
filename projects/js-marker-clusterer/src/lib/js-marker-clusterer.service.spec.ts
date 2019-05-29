import { TestBed } from '@angular/core/testing';

import { JsMarkerClustererService } from './js-marker-clusterer.service';

describe('JsMarkerClustererService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JsMarkerClustererService = TestBed.get(JsMarkerClustererService);
    expect(service).toBeTruthy();
  });
});
