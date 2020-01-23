import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { NgMapsCircle } from '../../directives/circle';
import { BoundsLiteral } from '../../interface/bounds';
import { CircleOptions } from '../../interface/circle-options';
import { GeoPoint } from '../../interface/geo-point';
import { MapsApiWrapper } from '../maps-api-wrapper';

@Injectable()
export abstract class CircleManager<T = any> {
  protected _circles: Map<NgMapsCircle, Promise<T>> = new Map<
    NgMapsCircle,
    Promise<T>
  >();

  constructor(protected _apiWrapper: MapsApiWrapper, protected _zone: NgZone) {}

  /**
   * @param circle
   */
  abstract addCircle(circle: NgMapsCircle);

  /**
   * Removes the given circle from the map.
   */
  abstract async removeCircle(circle: NgMapsCircle): Promise<void>;
  /**
   * @todo check how to improve type casting
   * @param circle instance of {@link NgMapsCircle}
   * @param options options for the circle
   */
  abstract async setOptions(
    circle: NgMapsCircle,
    options: CircleOptions,
  ): Promise<void>;

  abstract async getBounds(circle: NgMapsCircle): Promise<BoundsLiteral>;

  abstract async getCenter(circle: NgMapsCircle): Promise<GeoPoint>;

  abstract async getRadius(circle: NgMapsCircle): Promise<number>;

  abstract async setCenter(circle: NgMapsCircle): Promise<void>;

  abstract async setEditable(circle: NgMapsCircle): Promise<void>;

  abstract async setDraggable(circle: NgMapsCircle): Promise<void>;

  abstract async setVisible(circle: NgMapsCircle): Promise<void>;

  abstract async setRadius(circle: NgMapsCircle): Promise<void>;

  abstract createEventObservable<E>(
    eventName: string,
    circle: NgMapsCircle,
  ): Observable<E>;
}
