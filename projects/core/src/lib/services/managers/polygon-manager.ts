import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
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

  public abstract addPolygon(path: NgMapsPolygon);

  public abstract async updatePolygon(polygon: NgMapsPolygon): Promise<void>;

  public abstract async setPolygonOptions(
    path: NgMapsPolygon,
    options: { [propName: string]: any },
  ): Promise<void>;

  public abstract async deletePolygon(paths: NgMapsPolygon): Promise<void>;

  public abstract createEventObservable<E>(
    eventName: string,
    path: NgMapsPolygon,
  ): Observable<E>;
}
