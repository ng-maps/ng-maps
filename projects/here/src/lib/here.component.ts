import { Component, OnInit } from '@angular/core';
import {
  MapsApiWrapper,
  NgMapsViewComponent,
  MarkerManager,
  FitBoundsService,
} from '@ng-maps/core';
import { HereMapsWrapperService } from './here-maps-wrapper.service';
import { HereMapsMarkerManager } from './here-maps-marker.manager';
import { HereMapsFitBoundsService } from './here-maps-fit-bounds.service';

@Component({
  selector: 'agm-map, map-view',
  providers: [
    { provide: MapsApiWrapper, useClass: HereMapsWrapperService },
    { provide: FitBoundsService, useClass: HereMapsFitBoundsService },
    { provide: MarkerManager, useClass: HereMapsMarkerManager },
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
export class HereComponent extends NgMapsViewComponent {}
