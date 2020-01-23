import { Injectable } from '@angular/core';
import {
  NgMapsPolyline,
  NgMapsPolylinePoint,
  PolylineManager,
} from '@ng-maps/core';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class HerePolylineManager extends PolylineManager<H.map.Polyline> {
  protected _convertPoints(
    line: NgMapsPolyline,
  ): Array<google.maps.LatLngLiteral> {
    return line._getPoints().map((point: NgMapsPolylinePoint) => {
      return {
        lat: point.latitude,
        lng: point.longitude,
      } as google.maps.LatLngLiteral;
    });
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

  updatePolylinePoints(line: NgMapsPolyline): Promise<void> {
    const path = this._convertPoints(line);
    const m = this._polylines.get(line);
    if (m == null) {
      return Promise.resolve();
    }
    /*
    return m.then((l: google.maps.Polyline) =>
      this._zone.run(() => {
        l.setPath(path);
      }),
    );
     */
  }

  async setPolylineOptions(
    line: NgMapsPolyline,
    options: { [propName: string]: any },
  ): Promise<void> {
    const pl = await this._polylines.get(line);
    // pl.setOptions(options)
  }

  deletePolyline(line: NgMapsPolyline): Promise<void> {
    const m = this._polylines.get(line);
    if (m == null) {
      return Promise.resolve();
    }
    /*
    return m.then((l: H.map.Polyline) => {
      return this._zone.run(() => {
        l.setMap(null);
        this._polylines.delete(line);
      });
    });
     */
  }

  // @fixme
  // @ts-ignore
  createEventObservable(
    eventName: string,
    line: NgMapsPolyline,
  ): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this._polylines.get(line).then((l: H.map.Polyline) => {
        l.addEventListener(eventName, () => {
          this._zone.run(() => observer.next());
        });
      });
    });
  }
}
