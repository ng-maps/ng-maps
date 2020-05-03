import { Component } from '@angular/core';
import {
  CircleManager,
  FitBoundsService,
  GeoPoint,
  MapsApiWrapper,
  MarkerManager,
  NgMapsViewComponent,
  PolygonManager,
  PolylineManager,
  RectangleManager,
} from '@ng-maps/core';
import { fromPromise } from 'rxjs/internal-compatibility';
import { distinctUntilChanged, mergeMap } from 'rxjs/operators';
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
export class HereComponent extends NgMapsViewComponent {
  constructor() {}

  protected async _handleMapCenterChange(): Promise<void> {
    const s = this._mapsWrapper
      .subscribeToMapEvent('mapviewchangeend')
      .pipe(
        mergeMap(() => fromPromise(this._mapsWrapper.getCenter())),
        distinctUntilChanged(
          (p1, p2) => p1.lat === p2.lat && p1.lng === p2.lng,
        ),
      )
      .subscribe((center) => {
        this.centerChange.emit(center);
      });
    this.subscription.add(s);
  }

  protected _handleMapZoomChange(): void {
    const s = this._mapsWrapper
      .subscribeToMapEvent('mapviewchangeend')
      .pipe(
        mergeMap(() => fromPromise(this._mapsWrapper.getZoom())),
        distinctUntilChanged((z1, z2) => z1 === z2),
      )
      .subscribe((zoom) => {
        this.zoomChange.emit(zoom);
      });
    this.subscription.add(s);
  }

  protected _handleIdleEvent() {}

  protected _handleTilesLoadedEvent() {}

  protected _handleMapTypeIdChange() {}

  protected _handleBoundsChange() {
    const s = this._mapsWrapper
      .subscribeToMapEvent('mapviewchangeend')
      .pipe(
        mergeMap(() => fromPromise(this._mapsWrapper.getBounds())),
        distinctUntilChanged(
          (b1, b2) =>
            b1.east === b2.east &&
            b1.north === b2.north &&
            b1.west === b2.west &&
            b1.south === b2.south,
        ),
      )
      .subscribe((bounds) => {
        this.boundsChange.emit(bounds);
      });
    this.subscription.add(s);
  }

  protected _handleMapMouseEvents() {}
}
