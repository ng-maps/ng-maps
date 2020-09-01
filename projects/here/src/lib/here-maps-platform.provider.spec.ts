import { TestBed } from '@angular/core/testing';

import { HereMapsPlatformProvider } from './here-maps-platform.provider';

describe('HereMapsPlatformProvider', () => {
  let service: HereMapsPlatformProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HereMapsPlatformProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
