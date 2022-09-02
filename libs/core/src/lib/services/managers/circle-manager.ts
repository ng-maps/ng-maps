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
  public abstract removeCircle(circle: NgMapsCircleDirective): Promise<void>;
  /**
   * @todo check how to improve type casting
   * @param circle instance of {@link NgMapsCircleDirective}
   * @param options options for the circle
   */
  public abstract setOptions(
    circle: NgMapsCircleDirective,
    options: CircleOptions,
  ): Promise<void>;

  public abstract getBounds(
    circle: NgMapsCircleDirective,
  ): Promise<BoundsLiteral>;

  public abstract getCenter(circle: NgMapsCircleDirective): Promise<GeoPoint>;

  public abstract getRadius(circle: NgMapsCircleDirective): Promise<number>;

  public abstract setCenter(circle: NgMapsCircleDirective): Promise<void>;

  public abstract setEditable(circle: NgMapsCircleDirective): Promise<void>;

  public abstract setDraggable(circle: NgMapsCircleDirective): Promise<void>;

  public abstract setVisible(circle: NgMapsCircleDirective): Promise<void>;

  public abstract setRadius(circle: NgMapsCircleDirective): Promise<void>;

  public abstract createEventObservable<E>(
    eventName: string,
    circle: NgMapsCircleDirective,
  ): Observable<E>;
}
