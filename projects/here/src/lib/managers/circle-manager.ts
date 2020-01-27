import { Injectable, NgZone } from '@angular/core';
import {
  BoundsLiteral,
  CircleManager,
  GeoPoint,
  MapsApiWrapper,
  NgMapsCircle,
} from '@ng-maps/core';
import { EMPTY, Observable, Observer } from 'rxjs';
import { boundsFromRect } from '../convert';

@Injectable()
export class HereCircleManager extends CircleManager<H.map.Circle> {
  /**
   * @fixme implement commented properties
   * @param circle
   */
  addCircle(circle: NgMapsCircle) {
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
  async removeCircle(circle: NgMapsCircle): Promise<void> {
    const c = await this._circles.get(circle);
    c.dispose();
    this._circles.delete(circle);
  }

  /**
   * @todo check how to improve type casting
   * @param circle instance of {@link NgMapsCircle}
   * @param options options for the circle
   */
  async setOptions(
    circle: NgMapsCircle,
    options: google.maps.CircleOptions,
  ): Promise<void> {
    const c = await this._circles.get(circle);

    if (typeof options.strokePosition === 'string') {
      options.strokePosition = (google.maps.StrokePosition[
        options.strokePosition
      ] as any) as google.maps.StrokePosition;
    }
    // return c.setOptions(options);
  }

  async getBounds(circle: NgMapsCircle): Promise<BoundsLiteral> {
    const c = await this._circles.get(circle);
    return boundsFromRect(c.getBoundingBox());
  }

  async getCenter(circle: NgMapsCircle): Promise<GeoPoint> {
    const c = await this._circles.get(circle);
    return c.getCenter();
  }

  getRadius(circle: NgMapsCircle): Promise<number> {
    return this._circles.get(circle).then((c) => c.getRadius());
  }

  async setCenter(circle: NgMapsCircle): Promise<void> {
    const c = await this._circles.get(circle);
    c.setCenter({ lat: circle.latitude, lng: circle.longitude });
  }

  async setEditable(circle: NgMapsCircle): Promise<void> {}

  async setDraggable(circle: NgMapsCircle): Promise<void> {}

  async setVisible(circle: NgMapsCircle): Promise<void> {
    const c = await this._circles.get(circle);
    c.setVisibility(circle.visible);
  }

  setRadius(circle: NgMapsCircle): Promise<void> {
    return this._circles.get(circle).then((c) => c.setRadius(circle.radius));
  }

  createEventObservable<T>(
    eventName: string,
    circle: NgMapsCircle,
  ): Observable<T> {
    // return new Observable((observer: Observer<T>) => {
    //   let listener: google.maps.MapsEventListener = null;
    //   this._circles.get(circle).then((c) => {
    //     listener = c.addEventListener(eventName, (e: T) =>
    //       this._zone.run(() => observer.next(e)),
    //     );
    //   });
    //
    //   return () => {
    //     if (listener !== null) {
    //       listener.remove();
    //     }
    //   };
    // });
    return EMPTY;
  }
}
