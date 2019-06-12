import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { NgMapsPolygon } from '../directives/polygon';
import { GoogleMapsAPIWrapper, NgMapsViewComponent } from '@ng-maps/core';

@Injectable({
  providedIn: NgMapsViewComponent,
})
export class PolygonManager {
  private _polygons: Map<NgMapsPolygon, Promise<google.maps.Polygon>> = new Map<
    NgMapsPolygon,
    Promise<google.maps.Polygon>
  >();

  constructor(
    private _mapsWrapper: GoogleMapsAPIWrapper,
    private _zone: NgZone,
  ) {}

  addPolygon(path: NgMapsPolygon) {
    const polygonPromise = this._mapsWrapper.createPolygon({
      clickable: path.clickable,
      draggable: path.draggable,
      editable: path.editable,
      fillColor: path.fillColor,
      fillOpacity: path.fillOpacity,
      geodesic: path.geodesic,
      // @ts-ignore
      paths: path.paths,
      strokeColor: path.strokeColor,
      strokeOpacity: path.strokeOpacity,
      strokeWeight: path.strokeWeight,
      visible: path.visible,
      zIndex: path.zIndex,
    });
    this._polygons.set(path, polygonPromise);
  }

  updatePolygon(polygon: NgMapsPolygon): Promise<void> {
    const m = this._polygons.get(polygon);
    if (m == null) {
      return Promise.resolve();
    }
    // @ts-ignore
    return m.then((l: google.maps.Polygon) =>
      this._zone.run(() => {
        l.setPaths(polygon.paths);
      }),
    );
  }

  setPolygonOptions(
    path: NgMapsPolygon,
    options: { [propName: string]: any },
  ): Promise<void> {
    return this._polygons.get(path).then((l: google.maps.Polygon) => {
      l.setOptions(options);
    });
  }

  deletePolygon(paths: NgMapsPolygon): Promise<void> {
    const m = this._polygons.get(paths);
    if (m == null) {
      return Promise.resolve();
    }
    return m.then((l: google.maps.Polygon) => {
      return this._zone.run(() => {
        l.setMap(null);
        this._polygons.delete(paths);
      });
    });
  }

  createEventObservable<T>(
    eventName: string,
    path: NgMapsPolygon,
  ): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      this._polygons.get(path).then((l: google.maps.Polygon) => {
        l.addListener(eventName, (e: T) =>
          this._zone.run(() => observer.next(e)),
        );
      });
    });
  }
}
