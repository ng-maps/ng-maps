import { Injectable } from '@angular/core';

import {
  BoundsLiteral,
  FitBoundsService,
  GeoPoint,
  MapsAPILoader,
} from '@ng-maps/core';

import { boundsFromRect } from './convert';

@Injectable()
export class HereMapsFitBoundsService extends FitBoundsService {
  constructor(_apiLoader: MapsAPILoader) {
    super(_apiLoader);
  }

  protected generateBounds(
    includeInBounds: Map<string, GeoPoint>,
  ): BoundsLiteral {
    const points = Array.from(includeInBounds.values());
    const bounds = H.geo.Rect.coverPoints(points);
    return boundsFromRect(bounds);
  }
}
