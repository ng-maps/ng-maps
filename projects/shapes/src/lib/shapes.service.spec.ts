import { TestBed } from '@angular/core/testing';

import { ShapesService } from './shapes.service';

describe('ShapesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShapesService = TestBed.get(ShapesService);
    expect(service).toBeTruthy();
  });
});
