import {
  NgMapsViewComponent,
  MapsApiWrapper,
  FitBoundsService,
  MarkerManager,
} from '@ng-maps/core';
import { Component } from '@angular/core';
import { GoogleMapsAPIWrapper } from './google-maps-api-wrapper';
import { GoogleMapsMarkerManager } from './google-maps-marker.manager';
import { GoogleMapsFitBoundsService } from './google-maps-fit-bounds.service';

@Component({
  selector: 'agm-map, map-view',
  providers: [
    { provide: MapsApiWrapper, useClass: GoogleMapsAPIWrapper },
    { provide: FitBoundsService, useClass: GoogleMapsFitBoundsService },
    { provide: MarkerManager, useClass: GoogleMapsMarkerManager },
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
