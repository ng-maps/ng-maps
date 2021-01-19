import { Injectable, NgZone } from '@angular/core';
import {
  BoundsLiteral,
  MapsApiWrapper,
  NgMapsRectangleDirective,
  RectangleManager,
} from '@ng-maps/core';

import { Observable, Observer } from 'rxjs';

@Injectable()
export class GoogleRectangleManager extends RectangleManager<google.maps.Rectangle> {
  constructor(_mapsWrapper: MapsApiWrapper, _zone: NgZone) {
    super(_mapsWrapper, _zone);
  }

  public addRectangle(rectangle: NgMapsRectangleDirective) {
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
  public removeRectangle(rectangle: NgMapsRectangleDirective): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      r.setMap(null);
      this._rectangles.delete(rectangle);
    });
  }

  public setOptions(
    rectangle: NgMapsRectangleDirective,
    options: google.maps.RectangleOptions,
  ): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => r.setOptions(options));
  }

  public async getBounds(
    rectangle: NgMapsRectangleDirective,
  ): Promise<BoundsLiteral> {
    const r = await this._rectangles.get(rectangle);
    return r.getBounds().toJSON();
  }

  public setBounds(rectangle: NgMapsRectangleDirective): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      return r.setBounds({
        north: rectangle.north,
        east: rectangle.east,
        south: rectangle.south,
        west: rectangle.west,
      });
    });
  }

  public setEditable(rectangle: NgMapsRectangleDirective): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      return r.setEditable(rectangle.editable);
    });
  }

  public setDraggable(rectangle: NgMapsRectangleDirective): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      return r.setDraggable(rectangle.draggable);
    });
  }

  public setVisible(rectangle: NgMapsRectangleDirective): Promise<void> {
    return this._rectangles.get(rectangle).then((r) => {
      return r.setVisible(rectangle.visible);
    });
  }

  public createEventObservable<T>(
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
