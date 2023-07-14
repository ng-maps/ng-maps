import { Injectable, NgZone } from '@angular/core';
import { EMPTY, Observable, Observer } from 'rxjs';

import {
  MapsApiWrapper,
  MarkerManager,
  NgMapsMarkerComponent,
} from '@ng-maps/core';

@Injectable()
export class HereMapsMarkerManager extends MarkerManager<H.map.Marker> {
  public updateIconLegacy(marker: NgMapsMarkerComponent): void {
    throw new Error('Method not implemented.');
  }
  constructor(_mapsWrapper: MapsApiWrapper, _zone: NgZone) {
    super(_mapsWrapper, _zone);
  }

  public createEventObservable<E>(
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
          return this._zone.run(() => observer.next(e as unknown as E));
        });
      });
    });
  }

  public deleteMarker(marker: NgMapsMarkerComponent): void {}

  public updateAnimation(marker: NgMapsMarkerComponent): void {}

  public updateClickable(marker: NgMapsMarkerComponent): void {}

  public updateDraggable(marker: NgMapsMarkerComponent): void {}

  public updateIcon(marker: NgMapsMarkerComponent): void {
    const m: H.map.Marker = this._markers.get(marker);
    m.setIcon(marker.icon);
  }

  public updateLabel(marker: NgMapsMarkerComponent): void {}

  public updateMarkerPosition(marker: NgMapsMarkerComponent): void {
    const m: H.map.Marker = this._markers.get(marker);
    const { latitude, longitude } = marker;
    m.setGeometry({ lat: latitude, lng: longitude });
  }

  public updateOpacity(marker: NgMapsMarkerComponent): void {}

  public updateTitle(marker: NgMapsMarkerComponent): void {}

  public updateVisible(marker: NgMapsMarkerComponent): void {
    const m: H.map.Marker = this._markers.get(marker);
    m.setVisibility(marker.visible);
  }

  public updateZIndex(marker: NgMapsMarkerComponent): void {
    const m: H.map.Marker = this._markers.get(marker);
    m.setZIndex(marker.zIndex);
  }
}
