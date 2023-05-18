import { Injectable, NgZone } from '@angular/core';
import { EMPTY, Observable, Observer } from 'rxjs';

import {
  MapsApiWrapper,
  MarkerManager,
  NgMapsMarkerComponent,
} from '@ng-maps/core';

@Injectable()
export class HereMapsMarkerManager extends MarkerManager<H.map.Marker> {
  updateIconLegacy(marker: NgMapsMarkerComponent): void {
    throw new Error('Method not implemented.');
  }
  constructor(_mapsWrapper: MapsApiWrapper, _zone: NgZone) {
    super(_mapsWrapper, _zone);
  }

  createEventObservable<E>(
    eventName: string | Array<string>,
    marker: NgMapsMarkerComponent,
  ): Observable<E> {
    return new Observable((observer: Observer<E>) => {
      const m = this._markers.get(marker);
      if (typeof eventName === 'string') {
        eventName = [eventName];
      }
      eventName.forEach((event) => {
        m.addEventListener(event, (e: Event) => {
          // @todo fix typings
          return this._zone.run(() => observer.next(e as any as E));
        });
      });
    });
  }

  deleteMarker(marker: NgMapsMarkerComponent): void {}

  updateAnimation(marker: NgMapsMarkerComponent): void {}

  updateClickable(marker: NgMapsMarkerComponent): void {}

  updateDraggable(marker: NgMapsMarkerComponent): void {}

  updateIcon(marker: NgMapsMarkerComponent): void {}

  updateLabel(marker: NgMapsMarkerComponent): void {}

  updateMarkerPosition(marker: NgMapsMarkerComponent): void {
    const m: H.map.Marker = this._markers.get(marker);
    const { latitude, longitude } = marker;
    m.setGeometry({ lat: latitude, lng: longitude });
  }

  updateOpacity(marker: NgMapsMarkerComponent): void {}

  updateTitle(marker: NgMapsMarkerComponent): void {}

  updateVisible(marker: NgMapsMarkerComponent): void {
    const m: H.map.Marker = this._markers.get(marker);
    m.setVisibility(marker.visible);
  }

  updateZIndex(marker: NgMapsMarkerComponent): void {
    const m: H.map.Marker = this._markers.get(marker);
    m.setZIndex(marker.zIndex);
  }
}
