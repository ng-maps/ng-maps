import { Injectable, NgZone } from '@angular/core';
import { EMPTY, Observable, Observer } from 'rxjs';

import {
  MapsApiWrapper,
  NgMapsPolygonDirective,
  PolygonManager,
} from '@ng-maps/core';

@Injectable()
export class HerePolygonManager extends PolygonManager<H.map.Polygon> {
  constructor(_mapsWrapper: MapsApiWrapper, _zone: NgZone) {
    super(_mapsWrapper, _zone);
  }

  addPolygon(path: NgMapsPolygonDirective) {
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

  async updatePolygon(polygon: NgMapsPolygonDirective): Promise<void> {
    const item = await this._polygons.get(polygon);
    const lineString = new H.geo.LineString();
    polygon.paths.forEach((path) => {
      lineString.pushPoint(path);
    });
    const newPolygon = new H.geo.Polygon(lineString);
    item.setGeometry(newPolygon);
  }

  async setPolygonOptions(
    path: NgMapsPolygonDirective,
    options: { [propName: string]: any },
  ): Promise<void> {}

  async deletePolygon(polygon: NgMapsPolygonDirective): Promise<void> {
    const p = await this._polygons.get(polygon);
    if (p == null) {
      return Promise.resolve();
    }
    this._zone.run(() => {
      p.dispose();
      this._polygons.delete(polygon);
    });
  }

  createEventObservable<T>(
    eventName: string,
    path: NgMapsPolygonDirective,
  ): Observable<T> {
    // return new Observable((observer: Observer<T>) => {
    //   this._polygons.get(path).then((l: google.maps.Polygon) => {
    //     l.addListener(eventName, (e: T) =>
    //       this._zone.run(() => observer.next(e)),
    //     );
    //   });
    // });
    return EMPTY;
  }
}
