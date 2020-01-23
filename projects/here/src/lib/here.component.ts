import { Component } from '@angular/core';
import {
  CircleManager,
  FitBoundsService,
  MapsApiWrapper,
  MarkerManager,
  NgMapsViewComponent,
  PolygonManager,
  PolylineManager,
  RectangleManager,
} from '@ng-maps/core';
import { HereMapsFitBoundsService } from './here-maps-fit-bounds.service';
import { HereMapsMarkerManager } from './here-maps-marker.manager';
import { HereMapsWrapperService } from './here-maps-wrapper.service';
import { HereCircleManager } from './managers/circle-manager';
import { HerePolygonManager } from './managers/polygon-manager';
import { HerePolylineManager } from './managers/polyline-manager';
import { HereRectangleManager } from './managers/rectangle-manager';

@Component({
  selector: 'agm-map, map-view',
  providers: [
    { provide: MapsApiWrapper, useClass: HereMapsWrapperService },
    { provide: FitBoundsService, useClass: HereMapsFitBoundsService },
    { provide: MarkerManager, useClass: HereMapsMarkerManager },
    { provide: CircleManager, useClass: HereCircleManager },
    { provide: PolygonManager, useClass: HerePolygonManager },
    { provide: PolylineManager, useClass: HerePolylineManager },
    { provide: RectangleManager, useClass: HereRectangleManager },
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
