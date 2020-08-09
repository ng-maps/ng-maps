import { Injectable, NgZone } from '@angular/core';
import {
  MapsApiWrapper,
  MarkerManager,
  NgMapsMarkerComponent,
} from '@ng-maps/core';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class GoogleMapsMarkerManager extends MarkerManager<google.maps.Marker> {
  protected _markers: Map<NgMapsMarkerComponent, google.maps.Marker> = new Map<
    NgMapsMarkerComponent,
    google.maps.Marker
  >();

  constructor(_mapsWrapper: MapsApiWrapper, _zone: NgZone) {
    super(_mapsWrapper, _zone);
  }

  deleteMarker(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    if (m == null) {
      // marker already deleted
      return;
    } else {
      return this._zone.run(() => {
        m.setMap(null);
        this._markers.delete(marker);
      });
    }
  }

  updateMarkerPosition(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m.setPosition({ lat: marker.latitude, lng: marker.longitude });
  }

  updateTitle(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m.setTitle(marker.title);
  }

  updateLabel(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m.setLabel(marker.label);
  }

  updateDraggable(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m.setDraggable(marker.draggable);
  }

  updateIconLegacy(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m.setIcon(marker.iconUrl);
  }

  updateOpacity(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m.setOpacity(marker.opacity);
  }

  updateVisible(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m.setVisible(marker.visible);
  }

  updateZIndex(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m.setZIndex(marker.zIndex);
  }

  updateClickable(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m.setClickable(marker.clickable);
  }

  updateAnimation(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    if (typeof marker.animation === 'string') {
      m.setAnimation(google.maps.Animation[marker.animation]);
    } else {
      m.setAnimation(marker.animation);
    }
  }

  createEventObservable<T>(
    eventName:
      | google.maps.MarkerChangeOptionEventNames
      | google.maps.MarkerMouseEventNames,
    marker: NgMapsMarkerComponent,
  ): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      const m = this._markers.get(marker);
      m.addListener(eventName, (e: T) =>
        this._zone.run(() => observer.next(e)),
      );
    });
  }
}
