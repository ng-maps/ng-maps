import { Injectable, NgZone } from '@angular/core';
import { MapsApiWrapper, NgMapsViewComponent } from '@ng-maps/core';

import { Observable, Observer } from 'rxjs';

import { NgMapsRectangleDirective } from '../directives/rectangle';

@Injectable({
  providedIn: NgMapsViewComponent,
})
export class RectangleManager {
  private _rectangles: Map<
    NgMapsRectangleDirective,
    Promise<google.maps.Rectangle>
  > = new Map<NgMapsRectangleDirective, Promise<google.maps.Rectangle>>();

  constructor(private _apiWrapper: MapsApiWrapper, private _zone: NgZone) {}

  addRectangle(rectangle: NgMapsRectangleDirective) {
    this._rectangles.set(
      rectangle,
      this._apiWrapper.createRectangle({
        bounds: {
          north: rectangle.north,
          east: rectangle.east,
          south: rectangle.south,
          west: rectangle.west,
        },
        clickable: rectangle.clickable,
        draggable: rectangle.draggable,
        editable: rectangle.editable,
        fillColor: rectangle.fillColor,
        fillOpacity: rectangle.fillOpacity,
        strokeColor: rectangle.strokeColor,
        strokeOpacity: rectangle.strokeOpacity,
        // @ts-ignore
        strokePosition: rectangle.strokePosition,
        strokeWeight: rectangle.strokeWeight,
        visible: rectangle.visible,
        zIndex: rectangle.zIndex,
      }),
    );
  }

  /**
   * Removes the given rectangle from the map.
   */
  removeRectangle(rectangle: NgMapsRectangleDirective): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      r.setMap(null);
      this._rectangles.delete(rectangle);
    });
  }

  setOptions(
    rectangle: NgMapsRectangleDirective,
    options: google.maps.RectangleOptions,
  ): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => r.setOptions(options));
  }

  getBounds(
    rectangle: NgMapsRectangleDirective,
  ): Promise<google.maps.LatLngBounds> {
    return this._rectangles.get(rectangle).then((r) => r.getBounds());
  }

  setBounds(rectangle: NgMapsRectangleDirective): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      return r.setBounds({
        north: rectangle.north,
        east: rectangle.east,
        south: rectangle.south,
        west: rectangle.west,
      });
    });
  }

  setEditable(rectangle: NgMapsRectangleDirective): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      return r.setEditable(rectangle.editable);
    });
  }

  setDraggable(rectangle: NgMapsRectangleDirective): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      return r.setDraggable(rectangle.draggable);
    });
  }

  setVisible(rectangle: NgMapsRectangleDirective): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      return r.setVisible(rectangle.visible);
    });
  }

  createEventObservable<T>(
    eventName: string,
    rectangle: NgMapsRectangleDirective,
  ): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      let listener: google.maps.MapsEventListener = null;
      this._rectangles.get(rectangle).then((r) => {
        listener = r.addListener(eventName, (e: T) =>
          this._zone.run(() => observer.next(e)),
        );
      });

      return () => {
        if (listener !== null) {
          listener.remove();
        }
      };
    });
  }
}
