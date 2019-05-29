import { TestBed } from '@angular/core/testing';

import { SnazzyInfoWindowService } from './snazzy-info-window.service';

describe('SnazzyInfoWindowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SnazzyInfoWindowService = TestBed.get(SnazzyInfoWindowService);
    expect(service).toBeTruthy();
  });
});
