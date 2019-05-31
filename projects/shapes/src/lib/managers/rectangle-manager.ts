import { Injectable, NgZone } from '@angular/core';
import { GoogleMapsAPIWrapper, NgMapsViewComponent } from '@ng-maps/core';

import { Observable, Observer } from 'rxjs';

import { NgMapsRectangle } from '../directives/rectangle';

@Injectable({
  providedIn: NgMapsViewComponent
})
export class RectangleManager {
  private _rectangles: Map<NgMapsRectangle, Promise<google.maps.Rectangle>> =
    new Map<NgMapsRectangle, Promise<google.maps.Rectangle>>();

  constructor(private _apiWrapper: GoogleMapsAPIWrapper, private _zone: NgZone) {
  }

  addRectangle(rectangle: NgMapsRectangle) {
    console.log(this._apiWrapper);
    this._rectangles.set(rectangle, this._apiWrapper.createRectangle({
      bounds: {
        north: rectangle.north,
        east: rectangle.east,
        south: rectangle.south,
        west: rectangle.west
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
      zIndex: rectangle.zIndex
    }));
  }

  /**
   * Removes the given rectangle from the map.
   */
  removeRectangle(rectangle: NgMapsRectangle): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      r.setMap(null);
      this._rectangles.delete(rectangle);
    });
  }

  setOptions(rectangle: NgMapsRectangle, options: google.maps.RectangleOptions): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => r.setOptions(options));
  }

  getBounds(rectangle: NgMapsRectangle): Promise<google.maps.LatLngBounds> {
    return this._rectangles.get(rectangle).then((r) => r.getBounds());
  }

  setBounds(rectangle: NgMapsRectangle): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      return r.setBounds({
        north: rectangle.north,
        east: rectangle.east,
        south: rectangle.south,
        west: rectangle.west
      });
    });
  }

  setEditable(rectangle: NgMapsRectangle): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      return r.setEditable(rectangle.editable);
    });
  }

  setDraggable(rectangle: NgMapsRectangle): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      return r.setDraggable(rectangle.draggable);
    });
  }

  setVisible(rectangle: NgMapsRectangle): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      return r.setVisible(rectangle.visible);
    });
  }

  createEventObservable<T>(eventName: string, rectangle: NgMapsRectangle): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      let listener: google.maps.MapsEventListener = null;
      this._rectangles.get(rectangle).then((r) => {
        listener = r.addListener(eventName, (e: T) => this._zone.run(() => observer.next(e)));
      });

      return () => {
        if (listener !== null) {
          listener.remove();
        }
      };
    });
  }
}
