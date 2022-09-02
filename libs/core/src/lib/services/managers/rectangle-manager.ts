import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { NgMapsRectangleDirective } from '../../directives/rectangle';
import { BoundsLiteral } from '../../interface/bounds';
import { MapsApiWrapper } from '../maps-api-wrapper';

@Injectable()
export abstract class RectangleManager<T = any> {
  protected _rectangles: Map<NgMapsRectangleDirective, Promise<T>> = new Map<
    NgMapsRectangleDirective,
    Promise<T>
  >();

  constructor(protected _apiWrapper: MapsApiWrapper, protected _zone: NgZone) {}

  public abstract addRectangle(rectangle: NgMapsRectangleDirective): void;

  /**
   * Removes the given rectangle from the map.
   */
  public abstract removeRectangle(
    rectangle: NgMapsRectangleDirective,
  ): Promise<void>;

  public abstract setOptions(
    rectangle: NgMapsRectangleDirective,
    options: google.maps.RectangleOptions,
  ): Promise<void>;

  public abstract getBounds(
    rectangle: NgMapsRectangleDirective,
  ): Promise<BoundsLiteral>;

  public abstract setBounds(rectangle: NgMapsRectangleDirective): Promise<void>;

  public abstract setEditable(
    rectangle: NgMapsRectangleDirective,
  ): Promise<void>;

  public abstract setDraggable(
    rectangle: NgMapsRectangleDirective,
  ): Promise<void>;

  public abstract setVisible(
    rectangle: NgMapsRectangleDirective,
  ): Promise<void>;

  public abstract createEventObservable<E>(
    eventName: string,
    rectangle: NgMapsRectangleDirective,
  ): Observable<E>;
}
