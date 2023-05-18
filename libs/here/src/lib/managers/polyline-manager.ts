import { Injectable, NgZone } from '@angular/core';
import { EMPTY, Observable, Observer } from 'rxjs';

import {
  GeoPoint,
  MapsApiWrapper,
  NgMapsPolyline,
  NgMapsPolylinePoint,
  PolylineManager,
} from '@ng-maps/core';

@Injectable()
export class HerePolylineManager extends PolylineManager<H.map.Polyline> {
  constructor(_mapsWrapper: MapsApiWrapper, _zone: NgZone) {
    super(_mapsWrapper, _zone);
  }

  protected _convertPoints(line: NgMapsPolyline): Array<GeoPoint> {
    return line._getPoints().map((point: NgMapsPolylinePoint) => ({
      lat: point.latitude,
      lng: point.longitude,
    }));
  }

  addPolyline(line: NgMapsPolyline) {
    const path = this._convertPoints(line);
    const polylinePromise = this._mapsWrapper.createPolyline({
      clickable: line.clickable,
      draggable: line.draggable,
      editable: line.editable,
      geodesic: line.geodesic,
      strokeColor: line.strokeColor,
      strokeOpacity: line.strokeOpacity,
      strokeWeight: line.strokeWeight,
      visible: line.visible,
      zIndex: line.zIndex,
      icons: line.icons,
      path,
    });
    this._polylines.set(line, polylinePromise);
  }

  async updatePolylinePoints(line: NgMapsPolyline): Promise<void> {
    const path = this._convertPoints(line);
    const lineString = new H.geo.LineString();
    path.forEach((item) => {
      lineString.pushPoint(item);
    });
    const m = await this._polylines.get(line);
    if (m != null) {
      m.setGeometry(lineString);
    }
  }

  async setPolylineOptions(
    line: NgMapsPolyline,
    options: { [propName: string]: any },
  ): Promise<void> {
    const pl = await this._polylines.get(line);
    // pl.setOptions(options)
  }

  async deletePolyline(line: NgMapsPolyline): Promise<void> {
    const m = await this._polylines.get(line);
    if (m != null) {
      m.dispose();
      this._polylines.delete(line);
    }
  }

  createEventObservable(
    eventName: string,
    line: NgMapsPolyline,
  ): Observable<any> {
    // return new Observable((observer: Observer<void>) => {
    //   this._polylines.get(line).then((l: H.map.Polyline) => {
    //     l.addEventListener(eventName, () => {
    //       this._zone.run(() => observer.next());
    //     });
    //   });
    // });
    return EMPTY;
  }
}
