import { Injectable, NgZone } from '@angular/core';
import {
  InfoWindowManager,
  MapsApiWrapper,
  MarkerManager,
  NgMapsInfoWindowComponent,
} from '@ng-maps/core';
import { Observable, Observer } from 'rxjs';
import { HereMapsWrapperService } from '../here-maps-wrapper.service';

@Injectable()
export class HereMapsInfoWindowManager extends InfoWindowManager<
  H.ui.InfoBubble
> {
  constructor(
    _mapsWrapper: MapsApiWrapper,
    _zone: NgZone,
    _markerManager: MarkerManager,
  ) {
    super(_mapsWrapper, _zone, _markerManager);
  }

  async deleteInfoWindow(infoWindow: NgMapsInfoWindowComponent): Promise<void> {
    const iWindow = await this._infoWindows.get(infoWindow);
    if (iWindow == null) {
      // info window already deleted
      return;
    } else {
      return this._zone.run(() => {
        iWindow.close();
        (this._mapsWrapper as HereMapsWrapperService).ui.removeBubble(iWindow);
        this._infoWindows.delete(infoWindow);
      });
    }
  }

  setPosition(infoWindow: NgMapsInfoWindowComponent): void {
    const i = this._infoWindows.get(infoWindow);
    i.setPosition({
      lat: infoWindow.latitude,
      lng: infoWindow.longitude,
    });
  }

  /**
   * @todo implement
   * @param infoWindow
   */
  setZIndex(infoWindow: NgMapsInfoWindowComponent): void {}

  async open(infoWindow: NgMapsInfoWindowComponent, evt: any): Promise<void> {
    const w = this._infoWindows.get(infoWindow);
    const content = infoWindow.elementRef.nativeElement.cloneNode(true);
    w.setContent(content);
    w.open();
  }

  close(infoWindow: NgMapsInfoWindowComponent): void {
    const w = this._infoWindows.get(infoWindow);
    w.close();
  }

  setOptions(
    infoWindow: NgMapsInfoWindowComponent,
    options: google.maps.InfoWindowOptions,
  ) {
    const i = this._infoWindows.get(infoWindow);
    // i.setOptions(options);
  }

  async addInfoWindow(infoWindow: NgMapsInfoWindowComponent) {
    let point: H.geo.IPoint;
    await this._mapsWrapper.getNativeMap();
    if (infoWindow.hostMarker != null) {
      point = {
        lat: infoWindow.hostMarker.latitude,
        lng: infoWindow.hostMarker.longitude,
      };
    } else {
      point = { lat: infoWindow.latitude, lng: infoWindow.longitude };
    }
    const bubble = await this._mapsWrapper.createInfoWindow(point, null);
    this._infoWindows.set(infoWindow, bubble);
  }

  /**
   * Creates a Google Maps event listener for the given InfoWindow as an Observable
   */
  createEventObservable<E>(
    eventName: string,
    infoWindow: NgMapsInfoWindowComponent,
  ): Observable<E> {
    const i = this._infoWindows.get(infoWindow);
    return new Observable((observer: Observer<E>) => {
      i.addEventListener(eventName, (e: any) =>
        this._zone.run(() => observer.next(e)),
      );
    });
  }
}
