import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { NgMapsPolygon } from '../../directives/polygon';
import { MapsApiWrapper } from '../maps-api-wrapper';

@Injectable()
export abstract class PolygonManager<T = any> {
  protected _polygons: Map<NgMapsPolygon, Promise<T>> = new Map<
    NgMapsPolygon,
    Promise<T>
  >();

  constructor(
    protected _mapsWrapper: MapsApiWrapper,
    protected _zone: NgZone,
  ) {}

  abstract addPolygon(path: NgMapsPolygon);

  abstract async updatePolygon(polygon: NgMapsPolygon): Promise<void>;

  abstract async setPolygonOptions(
    path: NgMapsPolygon,
    options: { [propName: string]: any },
  ): Promise<void>;

  abstract async deletePolygon(paths: NgMapsPolygon): Promise<void>;

  abstract createEventObservable<E>(
    eventName: string,
    path: NgMapsPolygon,
  ): Observable<E>;
}
