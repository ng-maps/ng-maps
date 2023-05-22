import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import {
  MapsApiWrapper,
  NgMapsPolygonDirective,
  PolygonManager,
} from '@ng-maps/core';

@Injectable()
export class GooglePolygonManager extends PolygonManager<google.maps.Polygon> {
  constructor(_mapsWrapper: MapsApiWrapper, _zone: NgZone) {
    super(_mapsWrapper, _zone);
  }

  public addPolygon(path: NgMapsPolygonDirective) {
    const polygonPromise = this._mapsWrapper.createPolygon({
      clickable: path.clickable,
      draggable: path.draggable,
      editable: path.editable,
      fillColor: path.fillColor,
      fillOpacity: path.fillOpacity,
      geodesic: path.geodesic,
      paths: path.paths,
      strokeColor: path.strokeColor,
      strokeOpacity: path.strokeOpacity,
      strokeWeight: path.strokeWeight,
      visible: path.visible,
      zIndex: path.zIndex,
    });
    this._polygons.set(path, polygonPromise);
  }

  public async updatePolygon(polygon: NgMapsPolygonDirective): Promise<void> {
    const item = await this._polygons.get(polygon);
    if (item != null) {
      this._zone.run(() => {
        item.setPaths(polygon.paths);
      });
    }
  }

  public async setPolygonOptions(
    path: NgMapsPolygonDirective,
    options: { [propName: string]: any },
  ): Promise<void> {
    const l = await this._polygons.get(path);
    l?.setOptions(options);
  }

  public deletePolygon(paths: NgMapsPolygonDirective): Promise<void> {
    const m = this._polygons.get(paths);
    if (m == null) {
      return Promise.resolve();
    }
    return m.then((l: google.maps.Polygon) =>
      this._zone.run(() => {
        l.setMap(null);
        this._polygons.delete(paths);
      }),
    );
  }

  public createEventObservable<T>(
    eventName: string,
    path: NgMapsPolygonDirective,
  ): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      this._polygons.get(path)?.then((l: google.maps.Polygon) => {
        l.addListener(eventName, (e: T) =>
          this._zone.run(() => observer.next(e)),
        );
      });
    });
  }
}
