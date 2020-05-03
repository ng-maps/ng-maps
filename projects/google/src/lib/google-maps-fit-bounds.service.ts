import { Injectable } from '@angular/core';
import { BoundsLiteral, FitBoundsService, GeoPoint } from '@ng-maps/core';

/**
 * The FitBoundsService is responsible for computing the bounds of the a single map.
 */
@Injectable()
export class GoogleMapsFitBoundsService extends FitBoundsService {
  constructor() {}

  protected generateBounds(
    includeInBounds: Map<string, GeoPoint>,
  ): BoundsLiteral {
    const bounds = new google.maps.LatLngBounds();
    includeInBounds.forEach((b) => bounds.extend(b));
    return bounds.toJSON();
  }
}
