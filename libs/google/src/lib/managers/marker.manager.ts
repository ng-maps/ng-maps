import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import {
  MapsApiWrapper,
  MarkerManager,
  NgMapsMarkerComponent,
} from '@ng-maps/core';

@Injectable()
export class GoogleMapsMarkerManager extends MarkerManager<google.maps.Marker> {
  protected override _markers: Map<NgMapsMarkerComponent, google.maps.Marker> =
    new Map<NgMapsMarkerComponent, google.maps.Marker>();

  constructor(_mapsWrapper: MapsApiWrapper, _zone: NgZone) {
    super(_mapsWrapper, _zone);
  }

  public deleteMarker(marker: NgMapsMarkerComponent): void {
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

  public updateMarkerPosition(marker: NgMapsMarkerComponent): void {
    if (
      typeof marker.latitude !== 'number' ||
      typeof marker.longitude !== 'number'
    ) {
      return;
    }
    const m = this._markers.get(marker);
    m?.setPosition({ lat: marker.latitude, lng: marker.longitude });
  }

  public updateTitle(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m?.setTitle(marker.title);
  }

  public updateLabel(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m?.setLabel(marker.label);
  }

  public updateDraggable(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m?.setDraggable(marker.draggable);
  }

  public updateIconLegacy(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m?.setIcon(marker.iconUrl);
  }

  public updateOpacity(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m?.setOpacity(marker.opacity);
  }

  public updateVisible(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m?.setVisible(marker.visible);
  }

  public updateZIndex(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m?.setZIndex(marker.zIndex);
  }

  public updateClickable(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    m?.setClickable(marker.clickable);
  }

  public updateAnimation(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    if (typeof marker.animation === 'string') {
      m?.setAnimation(google.maps.Animation[marker.animation]);
    } else {
      m?.setAnimation(marker.animation);
    }
  }

  public createEventObservable<T>(
    eventName: string | Array<string>,
    marker: NgMapsMarkerComponent,
  ): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      const m = this._markers.get(marker);
      if (typeof eventName === 'string') {
        eventName = [eventName];
      }
      eventName.forEach((event) => {
        m?.addListener(event, (e: T) => this._zone.run(() => observer.next(e)));
      });
    });
  }

  public updateIcon(marker: NgMapsMarkerComponent): void {
    const m = this._markers.get(marker);
    if (m && marker.icon?.path) {
      // TODO correct typings
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      m.setIcon(marker.icon);
    }
  }
}
