import {
  NgMapsViewComponent,
  MapsApiWrapper,
  FitBoundsService,
  MarkerManager,
  CircleManager,
  PolygonManager,
  PolylineManager,
  RectangleManager,
} from '@ng-maps/core';
import { Component } from '@angular/core';
import { GoogleMapsAPIWrapper } from './google-maps-api-wrapper';
import { GoogleCircleManager } from './managers/circle-manager';
import { GoogleMapsMarkerManager } from './managers/marker.manager';
import { GoogleMapsFitBoundsService } from './google-maps-fit-bounds.service';
import { GooglePolygonManager } from './managers/polygon-manager';
import { GooglePolylineManager } from './managers/polyline-manager';
import { GoogleRectangleManager } from './managers/rectangle-manager';

@Component({
  selector: 'agm-map, map-view',
  providers: [
    { provide: MapsApiWrapper, useClass: GoogleMapsAPIWrapper },
    { provide: FitBoundsService, useClass: GoogleMapsFitBoundsService },
    { provide: MarkerManager, useClass: GoogleMapsMarkerManager },
    { provide: CircleManager, useClass: GoogleCircleManager },
    { provide: PolygonManager, useClass: GooglePolygonManager },
    { provide: PolylineManager, useClass: GooglePolylineManager },
    { provide: RectangleManager, useClass: GoogleRectangleManager },
  ],
  styles: [
    `
      .map-container-inner {
        width: inherit;
        height: inherit;
      }

      .map-content {
        display: none;
      }
    `,
  ],
  template: `
    <div class="map-container-inner" #container></div>
    <div class="map-content">
      <ng-content></ng-content>
    </div>
  `,
})
export class GoogleComponent extends NgMapsViewComponent {}
