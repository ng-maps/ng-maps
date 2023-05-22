import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import {
  BoundsLiteral,
  MapsApiWrapper,
  NgMapsRectangleDirective,
  RectangleManager,
} from '@ng-maps/core';

@Injectable()
export class GoogleRectangleManager extends RectangleManager<google.maps.Rectangle> {
  constructor(_mapsWrapper: MapsApiWrapper, _zone: NgZone) {
    super(_mapsWrapper, _zone);
  }

  public addRectangle(rectangle: NgMapsRectangleDirective) {
    if (
      !rectangle.north ||
      !rectangle.east ||
      !rectangle.south ||
      !rectangle.west
    ) {
      return;
    }

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
  public async removeRectangle(
    rectangle: NgMapsRectangleDirective,
  ): Promise<void> {
    return this._rectangles.get(rectangle)?.then((r) => {
      r.setMap(null);
      this._rectangles.delete(rectangle);
    });
  }

  public async setOptions(
    rectangle: NgMapsRectangleDirective,
    options: google.maps.RectangleOptions,
  ): Promise<void> {
    return this._rectangles.get(rectangle)?.then((r) => r.setOptions(options));
  }

  public async getBounds(
    rectangle: NgMapsRectangleDirective,
  ): Promise<BoundsLiteral | null> {
    const r = await this._rectangles.get(rectangle);
    const bounds = r?.getBounds();
    return bounds ? bounds.toJSON() : null;
  }

  public async setBounds(rectangle: NgMapsRectangleDirective): Promise<void> {
    if (
      !rectangle.north ||
      !rectangle.east ||
      !rectangle.south ||
      !rectangle.west
    ) {
      return;
    }
    const r = await this._rectangles.get(rectangle);
    r?.setBounds({
      north: rectangle.north,
      east: rectangle.east,
      south: rectangle.south,
      west: rectangle.west,
    });
  }

  public async setEditable(rectangle: NgMapsRectangleDirective): Promise<void> {
    return this._rectangles
      .get(rectangle)
      ?.then((r) => r.setEditable(rectangle.editable));
  }

  public async setDraggable(
    rectangle: NgMapsRectangleDirective,
  ): Promise<void> {
    return this._rectangles
      .get(rectangle)
      ?.then((r) => r.setDraggable(rectangle.draggable));
  }

  public async setVisible(rectangle: NgMapsRectangleDirective): Promise<void> {
    return this._rectangles
      .get(rectangle)
      ?.then((r) => r.setVisible(rectangle.visible));
  }

  public createEventObservable<T>(
    eventName: string,
    rectangle: NgMapsRectangleDirective,
  ): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      let listener: google.maps.MapsEventListener | null = null;
      this._rectangles.get(rectangle)?.then((r) => {
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
