import { Injectable } from '@angular/core';
import { FitBoundsService, GeoPoint, BoundsLiteral } from '@ng-maps/core';
import { boundsFromRect } from './convert';

@Injectable()
export class HereMapsFitBoundsService extends FitBoundsService {
  protected generateBounds(
    includeInBounds: Map<string, GeoPoint>,
  ): BoundsLiteral {
    const points = Array.from(includeInBounds.values());
    const bounds = H.geo.Rect.coverPoints(points);
    return boundsFromRect(bounds);
  }
}
