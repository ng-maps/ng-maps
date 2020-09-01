import { Injectable, NgZone } from '@angular/core';
import {
  BoundsLiteral,
  MapsApiWrapper,
  NgMapsRectangleDirective,
  RectangleManager,
} from '@ng-maps/core';

import { EMPTY, Observable, Observer } from 'rxjs';
import { boundsFromRect, rectFromBounds } from '../convert';

@Injectable()
export class HereRectangleManager extends RectangleManager<H.map.Rect> {
  constructor(_mapsWrapper: MapsApiWrapper, _zone: NgZone) {
    super(_mapsWrapper, _zone);
  }

  addRectangle(rectangle: NgMapsRectangleDirective) {
    this._rectangles.set(
      rectangle,
      this._apiWrapper.createRectangle(
        {
          north: rectangle.north,
          east: rectangle.east,
          south: rectangle.south,
          west: rectangle.west,
        },
        {
          // clickable: rectangle.clickable,
          // draggable: rectangle.draggable,
          // editable: rectangle.editable,
          fillColor: rectangle.fillColor,
          fillOpacity: rectangle.fillOpacity,
          strokeColor: rectangle.strokeColor,
          strokeOpacity: rectangle.strokeOpacity,
          // strokePosition: rectangle.strokePosition,
          strokeWeight: rectangle.strokeWeight,
          visible: rectangle.visible,
          zIndex: rectangle.zIndex,
        },
      ),
    );
  }

  /**
   * Removes the given rectangle from the map.
   */
  async removeRectangle(rectangle: NgMapsRectangleDirective): Promise<void> {
    const r = await this._rectangles.get(rectangle);
    r.dispose();
  }

  async setOptions(
    rectangle: NgMapsRectangleDirective,
    // options: RectangleOptions,
  ): Promise<void> {
    const r = await this._rectangles.get(rectangle);
    // r.setO
    // return this._rectangles.get(rectangle).then((r) => r.setOptions(options));
  }

  async getBounds(rectangle: NgMapsRectangleDirective): Promise<BoundsLiteral> {
    const r = await this._rectangles.get(rectangle);
    return boundsFromRect(r.getBoundingBox());
  }

  async setBounds(rectangle: NgMapsRectangleDirective): Promise<void> {
    const r = await this._rectangles.get(rectangle);
    return r.setBoundingBox(
      rectFromBounds({
        north: rectangle.north,
        east: rectangle.east,
        south: rectangle.south,
        west: rectangle.west,
      }),
    );
  }

  async setEditable(rectangle: NgMapsRectangleDirective): Promise<void> {}

  async setDraggable(rectangle: NgMapsRectangleDirective): Promise<void> {}

  async setVisible(rectangle: NgMapsRectangleDirective): Promise<void> {
    const r = await this._rectangles.get(rectangle);
    r.setVisibility(rectangle.visible);
  }

  createEventObservable<E>(
    eventName: string,
    rectangle: NgMapsRectangleDirective,
  ): Observable<E> {
    // return new Observable(subscriber => {
    //   const listener = (e: E) => this._zone.run(() => subscriber.next(e));
    //   this._rectangles.get(rectangle).then((r) => {
    //       r.addEventListener(eventName, listener);
    //     }
    //   );
    // );
    return EMPTY;
  }
}
