import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import { NgMapsPolyline } from '../../directives/polyline';
import { NgMapsPolylinePoint } from '../../directives/polyline-point';
import { GeoPoint } from '../../interface/geo-point';
import { MapsApiWrapper } from '../maps-api-wrapper';

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
    return line._getPoints().map(
      (point: NgMapsPolylinePoint) =>
        ({
          lat: point.latitude,
          lng: point.longitude,
        } as google.maps.LatLngLiteral),
    );
  }

  public abstract addPolyline(line: NgMapsPolyline);

  public abstract updatePolylinePoints(line: NgMapsPolyline): Promise<void>;

  public abstract setPolylineOptions(
    line: NgMapsPolyline,
    options: { [propName: string]: any },
  ): Promise<void>;

  public abstract deletePolyline(line: NgMapsPolyline): Promise<void>;

  public abstract createEventObservable<E>(
    eventName: string,
    line: NgMapsPolyline,
  ): Observable<E>;
}
