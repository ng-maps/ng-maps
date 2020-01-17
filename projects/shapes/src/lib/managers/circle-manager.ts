import { Injectable, NgZone } from '@angular/core';
import { MapsApiWrapper, NgMapsViewComponent } from '@ng-maps/core';
import { Observable, Observer } from 'rxjs';
import { NgMapsCircle } from '../directives/circle';

@Injectable({
  providedIn: NgMapsViewComponent,
})
export class CircleManager {
  private _circles: Map<NgMapsCircle, Promise<google.maps.Circle>> = new Map<
    NgMapsCircle,
    Promise<google.maps.Circle>
  >();

  constructor(private _apiWrapper: MapsApiWrapper, private _zone: NgZone) {}

  addCircle(circle: NgMapsCircle) {
    this._circles.set(
      circle,
      this._apiWrapper.createCircle({
        center: { lat: circle.latitude, lng: circle.longitude },
        clickable: circle.clickable,
        draggable: circle.draggable,
        editable: circle.editable,
        fillColor: circle.fillColor,
        fillOpacity: circle.fillOpacity,
        radius: circle.radius,
        strokeColor: circle.strokeColor,
        strokeOpacity: circle.strokeOpacity,
        strokePosition: circle.strokePosition,
        strokeWeight: circle.strokeWeight,
        visible: circle.visible,
        zIndex: circle.zIndex,
      }),
    );
  }

  /**
   * Removes the given circle from the map.
   */
  async removeCircle(circle: NgMapsCircle): Promise<void> {
    const c = await this._circles.get(circle);
    c.setMap(null);
    this._circles.delete(circle);
  }

  /**
   * @todo check how to improve type casting
   * @param circle
   * @param options
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
    return c.setOptions(options);
  }

  getBounds(circle: NgMapsCircle): Promise<google.maps.LatLngBounds> {
    return this._circles.get(circle).then((c) => c.getBounds());
  }

  getCenter(circle: NgMapsCircle): Promise<google.maps.LatLng> {
    return this._circles.get(circle).then((c) => c.getCenter());
  }

  getRadius(circle: NgMapsCircle): Promise<number> {
    return this._circles.get(circle).then((c) => c.getRadius());
  }

  setCenter(circle: NgMapsCircle): Promise<void> {
    return this._circles
      .get(circle)
      .then((c) =>
        c.setCenter({ lat: circle.latitude, lng: circle.longitude }),
      );
  }

  setEditable(circle: NgMapsCircle): Promise<void> {
    return this._circles
      .get(circle)
      .then((c) => c.setEditable(circle.editable));
  }

  setDraggable(circle: NgMapsCircle): Promise<void> {
    return this._circles
      .get(circle)
      .then((c) => c.setDraggable(circle.draggable));
  }

  setVisible(circle: NgMapsCircle): Promise<void> {
    return this._circles.get(circle).then((c) => c.setVisible(circle.visible));
  }

  setRadius(circle: NgMapsCircle): Promise<void> {
    return this._circles.get(circle).then((c) => c.setRadius(circle.radius));
  }

  createEventObservable<T>(
    eventName: string,
    circle: NgMapsCircle,
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
