import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
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
  public abstract addCircle(circle: NgMapsCircleDirective);

  /**
   * Removes the given circle from the map.
   */
  public abstract async removeCircle(
    circle: NgMapsCircleDirective,
  ): Promise<void>;
  /**
   * @todo check how to improve type casting
   * @param circle instance of {@link NgMapsCircleDirective}
   * @param options options for the circle
   */
  public abstract async setOptions(
    circle: NgMapsCircleDirective,
    options: CircleOptions,
  ): Promise<void>;

  public abstract async getBounds(
    circle: NgMapsCircleDirective,
  ): Promise<BoundsLiteral>;

  public abstract async getCenter(
    circle: NgMapsCircleDirective,
  ): Promise<GeoPoint>;

  public abstract async getRadius(
    circle: NgMapsCircleDirective,
  ): Promise<number>;

  public abstract async setCenter(circle: NgMapsCircleDirective): Promise<void>;

  public abstract async setEditable(
    circle: NgMapsCircleDirective,
  ): Promise<void>;

  public abstract async setDraggable(
    circle: NgMapsCircleDirective,
  ): Promise<void>;

  public abstract async setVisible(
    circle: NgMapsCircleDirective,
  ): Promise<void>;

  public abstract async setRadius(circle: NgMapsCircleDirective): Promise<void>;

  public abstract createEventObservable<E>(
    eventName: string,
    circle: NgMapsCircleDirective,
  ): Observable<E>;
}
