import { Injectable } from '@angular/core';
import { FitBoundsService, GeoPoint } from '@ng-maps/core';
import { BoundsLiteral } from '../../../core/src/lib/interface/bounds';
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
