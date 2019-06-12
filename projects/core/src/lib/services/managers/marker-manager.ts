import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { NgMapsViewComponent } from '../../directives/map';

import { NgMapsMarkerComponent } from '../../directives/marker';

import { GoogleMapsAPIWrapper } from '../google-maps-api-wrapper';

@Injectable({
  providedIn: NgMapsViewComponent,
})
export class MarkerManager {
  protected _markers: Map<NgMapsMarkerComponent, google.maps.Marker> = new Map<
    NgMapsMarkerComponent,
    google.maps.Marker
  >();

  constructor(
    protected _mapsWrapper: GoogleMapsAPIWrapper,
    protected _zone: NgZone,
  ) {}

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

  updateIcon(marker: NgMapsMarkerComponent): void {
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

  async addMarker(marker: NgMapsMarkerComponent): Promise<void> {
    const m = await this._mapsWrapper.createMarker({
      position: { lat: marker.latitude, lng: marker.longitude },
      label: marker.label,
      draggable: marker.draggable,
      icon: marker.iconUrl,
      opacity: marker.opacity,
      visible: marker.visible,
      zIndex: marker.zIndex,
      title: marker.title,
      clickable: marker.clickable,
      animation:
        typeof marker.animation === 'string'
          ? google.maps.Animation[marker.animation]
          : marker.animation,
    });
    this._markers.set(marker, m);
  }

  getNativeMarker(marker: NgMapsMarkerComponent): google.maps.Marker {
    return this._markers.get(marker);
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
