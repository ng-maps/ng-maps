import { Injectable, NgZone } from '@angular/core';
import {
  BoundsLiteral,
  CircleManager,
  GeoPoint,
  MapsApiWrapper,
  NgMapsCircleDirective,
} from '@ng-maps/core';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class GoogleCircleManager extends CircleManager<google.maps.Circle> {
  constructor(_mapsWrapper: MapsApiWrapper, _zone: NgZone) {
    super(_mapsWrapper, _zone);
  }

  /**
   * @fixme implement commented properties
   * @param circle
   */
  addCircle(circle: NgMapsCircleDirective) {
    this._circles.set(
      circle,
      this._apiWrapper.createCircle(
        { lat: circle.latitude, lng: circle.longitude },
        {
          // clickable: circle.clickable,
          // draggable: circle.draggable,
          // editable: circle.editable,
          fillColor: circle.fillColor,
          fillOpacity: circle.fillOpacity,
          radius: circle.radius,
          strokeColor: circle.strokeColor,
          strokeOpacity: circle.strokeOpacity,
          // strokePosition: circle.strokePosition,
          strokeWeight: circle.strokeWeight,
          visible: circle.visible,
          zIndex: circle.zIndex,
        },
      ),
    );
  }

  /**
   * Removes the given circle from the map.
   */
  async removeCircle(circle: NgMapsCircleDirective): Promise<void> {
    const c = await this._circles.get(circle);
    c.setMap(null);
    this._circles.delete(circle);
  }

  /**
   * @todo check how to improve type casting
   * @param circle instance of {@link NgMapsCircleDirective}
   * @param options options for the circle
   */
  async setOptions(
    circle: NgMapsCircleDirective,
    options: google.maps.CircleOptions,
  ): Promise<void> {
    const c = await this._circles.get(circle);

    if (typeof options.strokePosition === 'string') {
      options.strokePosition = (google.maps.StrokePosition[
        options.strokePosition
      ] as any) as google.maps.StrokePosition;
    }
    return c.setOptions(options);
  }

  async getBounds(circle: NgMapsCircleDirective): Promise<BoundsLiteral> {
    const c = await this._circles.get(circle);
    return c.getBounds().toJSON();
  }

  async getCenter(circle: NgMapsCircleDirective): Promise<GeoPoint> {
    const c = await this._circles.get(circle);
    return c.getCenter().toJSON();
  }

  getRadius(circle: NgMapsCircleDirective): Promise<number> {
    return this._circles.get(circle).then((c) => c.getRadius());
  }

  setCenter(circle: NgMapsCircleDirective): Promise<void> {
    return this._circles
      .get(circle)
      .then((c) =>
        c.setCenter({ lat: circle.latitude, lng: circle.longitude }),
      );
  }

  setEditable(circle: NgMapsCircleDirective): Promise<void> {
    return this._circles
      .get(circle)
      .then((c) => c.setEditable(circle.editable));
  }

  setDraggable(circle: NgMapsCircleDirective): Promise<void> {
    return this._circles
      .get(circle)
      .then((c) => c.setDraggable(circle.draggable));
  }

  setVisible(circle: NgMapsCircleDirective): Promise<void> {
    return this._circles.get(circle).then((c) => c.setVisible(circle.visible));
  }

  setRadius(circle: NgMapsCircleDirective): Promise<void> {
    return this._circles.get(circle).then((c) => c.setRadius(circle.radius));
  }

  createEventObservable<T>(
    eventName: string,
    circle: NgMapsCircleDirective,
  ): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      let listener: google.maps.MapsEventListener = null;
      this._circles.get(circle).then((c) => {
        listener = c.addListener(eventName, (e: T) =>
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
