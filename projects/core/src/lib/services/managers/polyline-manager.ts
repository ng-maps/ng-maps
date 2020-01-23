import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { GeoPoint } from '../../interface/geo-point';

import { MapsApiWrapper } from '../maps-api-wrapper';
import { NgMapsPolyline } from '../../directives/polyline';
import { NgMapsPolylinePoint } from '../../directives/polyline-point';

@Injectable()
export abstract class PolylineManager<T = any> {
  protected _polylines: Map<NgMapsPolyline, Promise<T>> = new Map<
    NgMapsPolyline,
    Promise<T>
  >();

  constructor(
    protected _mapsWrapper: MapsApiWrapper,
    protected _zone: NgZone,
  ) {}

  protected _convertPoints(line: NgMapsPolyline): Array<GeoPoint> {
    return line._getPoints().map((point: NgMapsPolylinePoint) => {
      return {
        lat: point.latitude,
        lng: point.longitude,
      } as google.maps.LatLngLiteral;
    });
  }

  abstract addPolyline(line: NgMapsPolyline);

  abstract async updatePolylinePoints(line: NgMapsPolyline): Promise<void>;

  abstract async setPolylineOptions(
    line: NgMapsPolyline,
    options: { [propName: string]: any },
  ): Promise<void>;

  abstract async deletePolyline(line: NgMapsPolyline): Promise<void>;

  abstract createEventObservable<E>(
    eventName: string,
    line: NgMapsPolyline,
  ): Observable<E>;
}
