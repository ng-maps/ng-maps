import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import { NgMapsPolygonDirective } from '../../directives/polygon';
import { MapsApiWrapper } from '../maps-api-wrapper';

@Injectable()
export abstract class PolygonManager<T = any> {
  protected _polygons: Map<NgMapsPolygonDirective, Promise<T>> = new Map<
    NgMapsPolygonDirective,
    Promise<T>
  >();

  constructor(
    protected _mapsWrapper: MapsApiWrapper,
    protected _zone: NgZone,
  ) {}

  public abstract addPolygon(path: NgMapsPolygonDirective);

  public abstract updatePolygon(polygon: NgMapsPolygonDirective): Promise<void>;

  public abstract setPolygonOptions(
    path: NgMapsPolygonDirective,
    options: { [propName: string]: any },
  ): Promise<void>;

  public abstract deletePolygon(paths: NgMapsPolygonDirective): Promise<void>;

  public abstract createEventObservable<E>(
    eventName: string,
    path: NgMapsPolygonDirective,
  ): Observable<E>;
}
