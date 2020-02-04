import { Injectable } from '@angular/core';
import { NgMapsPolygon, PolygonManager } from '@ng-maps/core';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class GooglePolygonManager extends PolygonManager<google.maps.Polygon> {
  addPolygon(path: NgMapsPolygon) {
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

  async updatePolygon(polygon: NgMapsPolygon): Promise<void> {
    const item = await this._polygons.get(polygon);
    if (item != null) {
      this._zone.run(() => {
        item.setPaths(polygon.paths);
      });
    }
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
