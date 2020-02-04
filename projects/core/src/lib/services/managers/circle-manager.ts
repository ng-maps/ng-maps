import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { NgMapsCircleDirective } from '../../directives/circle';
import { BoundsLiteral } from '../../interface/bounds';
import { CircleOptions } from '../../interface/circle-options';
import { GeoPoint } from '../../interface/geo-point';
import { MapsApiWrapper } from '../maps-api-wrapper';

@Injectable()
export abstract class CircleManager<T = any> {
  protected _circles: Map<NgMapsCircleDirective, Promise<T>> = new Map<
    NgMapsCircleDirective,
    Promise<T>
  >();

  constructor(protected _apiWrapper: MapsApiWrapper, protected _zone: NgZone) {}

  /**
   * @param circle
   */
  abstract addCircle(circle: NgMapsCircleDirective);

  /**
   * Removes the given circle from the map.
   */
  abstract async removeCircle(circle: NgMapsCircleDirective): Promise<void>;
  /**
   * @todo check how to improve type casting
   * @param circle instance of {@link NgMapsCircleDirective}
   * @param options options for the circle
   */
  abstract async setOptions(
    circle: NgMapsCircleDirective,
    options: CircleOptions,
  ): Promise<void>;

  abstract async getBounds(
    circle: NgMapsCircleDirective,
  ): Promise<BoundsLiteral>;

  abstract async getCenter(circle: NgMapsCircleDirective): Promise<GeoPoint>;

  abstract async getRadius(circle: NgMapsCircleDirective): Promise<number>;

  abstract async setCenter(circle: NgMapsCircleDirective): Promise<void>;

  abstract async setEditable(circle: NgMapsCircleDirective): Promise<void>;

  abstract async setDraggable(circle: NgMapsCircleDirective): Promise<void>;

  abstract async setVisible(circle: NgMapsCircleDirective): Promise<void>;

  abstract async setRadius(circle: NgMapsCircleDirective): Promise<void>;

  abstract createEventObservable<E>(
    eventName: string,
    circle: NgMapsCircleDirective,
  ): Observable<E>;
}
