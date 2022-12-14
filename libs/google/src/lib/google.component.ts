import { Component, NgZone } from '@angular/core';

import {
  CircleManager,
  FitBoundsService,
  GeoPoint,
  InfoWindowManager,
  MapsApiWrapper,
  MarkerManager,
  NgMapsViewComponent,
  PolygonManager,
  PolylineManager,
  RectangleManager,
} from '@ng-maps/core';

import { GoogleMapsAPIWrapper } from './google-maps-api-wrapper';
import { GoogleMapsFitBoundsService } from './google-maps-fit-bounds.service';
import { GoogleCircleManager } from './managers/circle.manager';
import { GoogleInfoWindowManager } from './managers/info-window.manager';
import { GoogleMapsMarkerManager } from './managers/marker.manager';
import { GooglePolygonManager } from './managers/polygon.manager';
import { GooglePolylineManager } from './managers/polyline.manager';
import { GoogleRectangleManager } from './managers/rectangle.manager';

@Component({
  selector: 'map-view',
  providers: [
    { provide: MapsApiWrapper, useClass: GoogleMapsAPIWrapper },
    { provide: FitBoundsService, useClass: GoogleMapsFitBoundsService },
    { provide: MarkerManager, useClass: GoogleMapsMarkerManager },
    { provide: CircleManager, useClass: GoogleCircleManager },
    { provide: PolygonManager, useClass: GooglePolygonManager },
    { provide: PolylineManager, useClass: GooglePolylineManager },
    { provide: RectangleManager, useClass: GoogleRectangleManager },
    { provide: InfoWindowManager, useClass: GoogleInfoWindowManager },
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
export class GoogleComponent extends NgMapsViewComponent<google.maps.Map> {
  constructor(
    _mapsWrapper: MapsApiWrapper,
    _fitBoundsService: FitBoundsService,
    _zone: NgZone,
  ) {
    super(_mapsWrapper, _fitBoundsService, _zone);
  }

  protected async _handleMapCenterChange() {
    const s = this._mapsWrapper
      .subscribeToMapEvent('center_changed')
      .subscribe(() => {
        this._mapsWrapper.getCenter().then((center: GeoPoint) => {
          this.latitude = center.lat;
          this.longitude = center.lng;
          this.centerChange.emit({
            lat: this.latitude,
            lng: this.longitude,
          } as google.maps.LatLngLiteral);
        });
      });
    this.subscription.add(s);
  }

  protected _handleBoundsChange() {
    const s = this._mapsWrapper
      .subscribeToMapEvent('bounds_changed')
      .subscribe(() => {
        this._mapsWrapper.getBounds().then((bounds) => {
          this.boundsChange.emit(bounds);
        });
      });
    this.subscription.add(s);
  }

  protected _handleMapTypeIdChange() {
    const s = this._mapsWrapper
      .subscribeToMapEvent('maptypeid_changed')
      .subscribe(() => {
        this._mapsWrapper
          .getMapTypeId()
          .then((mapTypeId: google.maps.MapTypeId) => {
            this.mapTypeIdChange.emit(mapTypeId);
          });
      });
    this.subscription.add(s);
  }

  protected _handleMapZoomChange() {
    const s = this._mapsWrapper
      .subscribeToMapEvent('zoom_changed')
      .subscribe(() => {
        this._mapsWrapper.getZoom().then((z: number) => {
          this.zoom = z;
          this.zoomChange.emit(z);
        });
      });
    this.subscription.add(s);
  }

  protected _handleIdleEvent() {
    const s = this._mapsWrapper.subscribeToMapEvent('idle').subscribe(() => {
      this.idle.emit(void 0);
    });
    this.subscription.add(s);
  }

  protected _handleTilesLoadedEvent() {
    const s = this._mapsWrapper
      .subscribeToMapEvent('tilesloaded')
      .subscribe(() => this.tilesLoaded.emit(void 0));
    this.subscription.add(s);
  }

  protected _handleMapMouseEvents() {
    interface Emitter {
      emit(value: any): void;
    }

    interface Event {
      name: string;
      emitter: Emitter;
    }

    const events: Array<Event> = [
      { name: 'click', emitter: this.mapClick },
      { name: 'rightclick', emitter: this.mapRightClick },
      { name: 'dblclick', emitter: this.mapDblClick },
    ];

    events.forEach((e: Event) => {
      const s = (this._mapsWrapper as GoogleMapsAPIWrapper)
        .subscribeToMapEvent(e.name)
        .subscribe((event) => {
          const value = {
            coords: { lat: event[0].latLng.lat(), lng: event[0].latLng.lng() },
          };
          e.emitter.emit(value);
        });
      this.subscription.add(s);
    });
  }
}
