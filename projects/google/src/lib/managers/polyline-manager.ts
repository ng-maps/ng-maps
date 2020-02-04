import { Injectable } from '@angular/core';
import {
  NgMapsPolyline,
  NgMapsPolylinePoint,
  PolylineManager,
} from '@ng-maps/core';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class GooglePolylineManager extends PolylineManager<
  google.maps.Polyline
> {
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
    return m.then((l: google.maps.Polyline) =>
      this._zone.run(() => {
        l.setPath(path);
      }),
    );
  }

  setPolylineOptions(
    line: NgMapsPolyline,
    options: { [propName: string]: any },
  ): Promise<void> {
    return this._polylines.get(line).then((l: google.maps.Polyline) => {
      l.setOptions(options);
    });
  }

  deletePolyline(line: NgMapsPolyline): Promise<void> {
    const m = this._polylines.get(line);
    if (m == null) {
      return Promise.resolve();
    }
    return m.then((l: google.maps.Polyline) => {
      return this._zone.run(() => {
        l.setMap(null);
        this._polylines.delete(line);
      });
    });
  }

  createEventObservable<T>(
    eventName: string,
    line: NgMapsPolyline,
  ): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      this._polylines.get(line).then((l: google.maps.Polyline) => {
        l.addListener(eventName, (e: T) =>
          this._zone.run(() => observer.next(e)),
        );
      });
    });
  }
}
