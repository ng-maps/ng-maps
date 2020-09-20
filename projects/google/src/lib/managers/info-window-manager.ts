import { Injectable, NgZone } from '@angular/core';
import {
  GeoPoint,
  InfoWindowManager,
  MapsApiWrapper,
  MarkerManager,
  NgMapsInfoWindowComponent,
} from '@ng-maps/core';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class GoogleInfoWindowManager extends InfoWindowManager<
  google.maps.InfoWindow
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

  setZIndex(infoWindow: NgMapsInfoWindowComponent): void {
    const i = this._infoWindows.get(infoWindow);
    i.setZIndex(infoWindow.zIndex);
  }

  async open(infoWindow: NgMapsInfoWindowComponent): Promise<void> {
    const w = this._infoWindows.get(infoWindow);
    const map = await this._mapsWrapper.getNativeMap();
    if (infoWindow.hostMarker != null) {
      const marker = await this._markerManager.getNativeMarker(
        infoWindow.hostMarker,
      );
      w.open(map, marker);
    } else {
      w.open(map);
    }
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
    i.setOptions(options);
  }

  async addInfoWindow(infoWindow: NgMapsInfoWindowComponent) {
    const options: google.maps.InfoWindowOptions = {
      content: infoWindow.content.nativeElement,
      maxWidth: infoWindow.maxWidth,
      zIndex: infoWindow.zIndex,
      disableAutoPan: infoWindow.disableAutoPan,
    };
    const center: GeoPoint =
      typeof infoWindow.latitude === 'number' &&
      typeof infoWindow.longitude === 'number'
        ? {
            lat: infoWindow.latitude,
            lng: infoWindow.longitude,
          }
        : null;
    const instance = await this._mapsWrapper.createInfoWindow(center, options);
    this._infoWindows.set(infoWindow, instance);
  }

  /**
   * Creates a Google Maps event listener for the given InfoWindow as an Observable
   */
  createEventObservable<T>(
    eventName: string,
    infoWindow: NgMapsInfoWindowComponent,
  ): Observable<T> {
    const i = this._infoWindows.get(infoWindow);
    return new Observable((observer: Observer<T>) => {
      i.addListener(eventName, (e: T) =>
        this._zone.run(() => observer.next(e)),
      );
    });
  }
}
