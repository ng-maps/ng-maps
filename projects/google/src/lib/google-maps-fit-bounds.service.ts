import { Injectable, NgZone } from '@angular/core';
import {
  BoundsLiteral,
  FitBoundsService,
  GeoPoint,
  MapsAPILoader,
  MapsApiWrapper,
} from '@ng-maps/core';

/**
 * The FitBoundsService is responsible for computing the bounds of the a single map.
 */
@Injectable()
export class GoogleMapsFitBoundsService extends FitBoundsService {
  constructor(_loader: MapsAPILoader) {
    super(_loader);
  }

  protected generateBounds(
    includeInBounds: Map<string, GeoPoint>,
  ): BoundsLiteral {
    const bounds = new google.maps.LatLngBounds();
    includeInBounds.forEach((b) => bounds.extend(b));
    return bounds.toJSON();
  }
}
