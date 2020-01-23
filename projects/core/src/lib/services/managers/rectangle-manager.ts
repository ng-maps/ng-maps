import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { NgMapsRectangleDirective } from '../../directives/rectangle';
import { BoundsLiteral } from '../../interface/bounds';
import { GeoPoint } from '../../interface/geo-point';
import { MapsApiWrapper } from '../maps-api-wrapper';

@Injectable()
export abstract class RectangleManager<T = any> {
  protected _rectangles: Map<NgMapsRectangleDirective, Promise<T>> = new Map<
    NgMapsRectangleDirective,
    Promise<T>
  >();

  constructor(protected _apiWrapper: MapsApiWrapper, protected _zone: NgZone) {}

  abstract addRectangle(rectangle: NgMapsRectangleDirective): void;

  /**
   * Removes the given rectangle from the map.
   */
  abstract async removeRectangle(
    rectangle: NgMapsRectangleDirective,
  ): Promise<void>;

  abstract async setOptions(
    rectangle: NgMapsRectangleDirective,
    options: google.maps.RectangleOptions,
  ): Promise<void>;

  abstract async getBounds(
    rectangle: NgMapsRectangleDirective,
  ): Promise<BoundsLiteral>;

  abstract async setBounds(rectangle: NgMapsRectangleDirective): Promise<void>;

  abstract async setEditable(
    rectangle: NgMapsRectangleDirective,
  ): Promise<void>;

  abstract async setDraggable(
    rectangle: NgMapsRectangleDirective,
  ): Promise<void>;

  abstract async setVisible(rectangle: NgMapsRectangleDirective): Promise<void>;

  abstract createEventObservable<E>(
    eventName: string,
    rectangle: NgMapsRectangleDirective,
  ): Observable<E>;
}
