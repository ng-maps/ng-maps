import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import {
  BoundsLiteral,
  CircleManager,
  GeoPoint,
  MapsApiWrapper,
  NgMapsCircleDirective,
} from '@ng-maps/core';

@Injectable()
export class GoogleCircleManager extends CircleManager<google.maps.Circle> {
  constructor(_mapsWrapper: MapsApiWrapper, _zone: NgZone) {
    super(_mapsWrapper, _zone);
  }

  /**
   * @fixme implement commented properties
   */
  public async addCircle(circle: NgMapsCircleDirective) {
    if (!circle.latitude || !circle.longitude) {
      return;
    }
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
  public async removeCircle(circle: NgMapsCircleDirective): Promise<void> {
    const c = await this._circles.get(circle);
    c?.setMap(null);
    this._circles.delete(circle);
  }

  /**
   * @todo check how to improve type casting
   * @param circle instance of {@link NgMapsCircleDirective}
   * @param options options for the circle
   */
  public async setOptions(
    circle: NgMapsCircleDirective,
    options: google.maps.CircleOptions,
  ): Promise<void> {
    const c = await this._circles.get(circle);

    if (typeof options.strokePosition === 'string') {
      options.strokePosition = google.maps.StrokePosition[
        options.strokePosition
      ] as any as google.maps.StrokePosition;
    }
    return c?.setOptions(options);
  }

  public async getBounds(
    circle: NgMapsCircleDirective,
  ): Promise<BoundsLiteral | null> {
    const c = await this._circles.get(circle);
    if (!c) {
      return null;
    }
    const bounds = c.getBounds();
    return bounds ? bounds.toJSON() : null;
  }

  public async getCenter(
    circle: NgMapsCircleDirective,
  ): Promise<GeoPoint | null> {
    const c = await this._circles.get(circle);
    const center = c?.getCenter();
    return center ? center.toJSON() : null;
  }

  public async getRadius(
    circle: NgMapsCircleDirective,
  ): Promise<number | null> {
    const c = await this._circles.get(circle);
    return c?.getRadius() ?? null;
  }

  public async setCenter(circle: NgMapsCircleDirective): Promise<void> {
    if (!circle.latitude || !circle.longitude) {
      return;
    }
    const c = await this._circles.get(circle);
    c?.setCenter({ lat: circle.latitude, lng: circle.longitude });
  }

  public async setEditable(circle: NgMapsCircleDirective): Promise<void> {
    const c = await this._circles.get(circle);
    c?.setEditable(circle.editable);
  }

  public async setDraggable(circle: NgMapsCircleDirective): Promise<void> {
    const c = await this._circles.get(circle);
    c?.setDraggable(circle.draggable);
  }

  public async setVisible(circle: NgMapsCircleDirective): Promise<void> {
    const c = await this._circles.get(circle);
    c?.setVisible(circle.visible);
  }

  public async setRadius(circle: NgMapsCircleDirective): Promise<void> {
    const c = await this._circles.get(circle);
    c?.setRadius(circle.radius);
  }

  public createEventObservable<T>(
    eventName: string,
    circle: NgMapsCircleDirective,
  ): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      let listener: google.maps.MapsEventListener | null = null;
      this._circles?.get(circle)?.then((c) => {
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
