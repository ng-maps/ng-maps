import { Injectable } from '@angular/core';
import {
  BoundsLiteral,
  CircleOptions,
  GeoPoint,
  MapOptions,
  MapsApiWrapper,
  MarkerOptions,
  RectangleOptions,
} from '@ng-maps/core';
import { Observable, Observer } from 'rxjs';

/**
 * Wrapper class that handles the communication with the Google Maps Javascript
 * API v3
 */
@Injectable()
export class GoogleMapsAPIWrapper extends MapsApiWrapper<
  google.maps.Map,
  google.maps.Circle,
  google.maps.Rectangle
> {
  constructor() {}

  protected _api: Promise<google.maps.Map>;
  protected _mapResolver: (value?: google.maps.Map) => void;

  createMap(
    el: HTMLElement,
    center: GeoPoint,
    options: MapOptions,
  ): Promise<void> {
    return this._zone.runOutsideAngular(async () => {
      await this._loader.load();
      this._mapResolver(new google.maps.Map(el, { center, ...options }));
      return;
    });
  }

  async setMapOptions(options: google.maps.MapOptions) {
    const map = await this._api;
    map.setOptions(options);
  }

  /**
   * Creates a google map drawing manager with the map context
   */
  async createDrawingManager(
    options: google.maps.drawing.DrawingManagerOptions = {},
    addToMap: boolean = true,
  ): Promise<google.maps.drawing.DrawingManager> {
    const map = await this._api;
    if (addToMap) {
      options.map = map;
    }
    return new google.maps.drawing.DrawingManager(options);
  }

  /**
   * Creates a google map marker with the map context
   */
  async createMarker(
    position: GeoPoint,
    options: MarkerOptions,
    addToMap: boolean = true,
  ): Promise<google.maps.Marker> {
    let map;
    if (addToMap) {
      map = await this._api;
    } else {
      map = {};
    }
    return new google.maps.Marker({ position, map, ...options });
  }

  async createInfoWindow(
    center: GeoPoint,
    options?: google.maps.InfoWindowOptions,
  ): Promise<google.maps.InfoWindow> {
    await this._api;
    return new google.maps.InfoWindow({ position: center, ...options });
  }

  /**
   * Creates a google.map.Circle for the current map.
   * @todo check how to improve type casting
   */
  async createCircle(
    center: GeoPoint,
    options: CircleOptions,
  ): Promise<google.maps.Circle> {
    const opt: google.maps.CircleOptions = {
      ...options,
      center,
      map: await this._api,
    };
    if (typeof opt.strokePosition === 'string') {
      opt.strokePosition = (google.maps.StrokePosition[
        opt.strokePosition
      ] as any) as google.maps.StrokePosition;
    }
    return new google.maps.Circle(opt);
  }

  /**
   * Creates a google.map.Rectangle for the current map.
   */
  async createRectangle(
    bounds: BoundsLiteral,
    options: RectangleOptions,
  ): Promise<google.maps.Rectangle> {
    const map = await this._api;
    return new google.maps.Rectangle({
      ...options,
      bounds,
      map,
    });
  }

  createPolyline(
    options: google.maps.PolylineOptions,
  ): Promise<google.maps.Polyline> {
    return this.getNativeMap().then((map: google.maps.Map) => {
      const line = new google.maps.Polyline(options);
      line.setMap(map);
      return line;
    });
  }

  createPolygon(
    options: google.maps.PolygonOptions,
  ): Promise<google.maps.Polygon> {
    return this.getNativeMap().then((map: google.maps.Map) => {
      const polygon = new google.maps.Polygon(options);
      polygon.setMap(map);
      return polygon;
    });
  }

  /**
   * Creates a new google.map.Data layer for the current map
   */
  createDataLayer(
    options?: google.maps.Data.DataOptions,
  ): Promise<google.maps.Data> {
    return this._api.then((m) => {
      const data = new google.maps.Data(options);
      data.setMap(m);
      return data;
    });
  }

  /**
   * Determines if given coordinates are insite a Polygon path.
   */
  containsLocation(
    latLng: google.maps.LatLng,
    polygon: google.maps.Polygon,
  ): boolean {
    return google.maps.geometry.poly.containsLocation(latLng, polygon);
  }

  subscribeToMapEvent<E>(eventName: string): Observable<E> {
    return new Observable((observer: Observer<E>) => {
      this._api.then((m: google.maps.Map) => {
        m.addListener(eventName, (arg: E) => {
          this._zone.run(() => observer.next(arg));
        });
      });
    });
  }

  clearInstanceListeners() {
    this._api.then((map: google.maps.Map) => {
      google.maps.event.clearInstanceListeners(map);
    });
  }

  setCenter(latLng: google.maps.LatLngLiteral): Promise<void> {
    return this._api.then((map: google.maps.Map) => map.setCenter(latLng));
  }

  getZoom(): Promise<number> {
    return this._api.then((map: google.maps.Map) => map.getZoom());
  }

  async getBounds(): Promise<BoundsLiteral> {
    const map = await this._api;
    return map.getBounds().toJSON();
  }

  getMapTypeId(): Promise<google.maps.MapTypeId | string> {
    return this._api.then((map: google.maps.Map) => map.getMapTypeId());
  }

  setZoom(zoom: number): Promise<void> {
    return this._api.then((map: google.maps.Map) => map.setZoom(zoom));
  }

  async getCenter(): Promise<GeoPoint> {
    const map = await this._api;
    return map.getCenter().toJSON();
  }

  panTo(latLng: google.maps.LatLng | google.maps.LatLngLiteral): Promise<void> {
    return this._api.then((map) => map.panTo(latLng));
  }

  panBy(x: number, y: number): Promise<void> {
    return this._api.then((map) => map.panBy(x, y));
  }

  async fitBounds(
    latLng: BoundsLiteral,
    padding?: number | google.maps.Padding,
  ): Promise<void> {
    const map = await this._api;
    return map.fitBounds(latLng, padding);
  }

  async panToBounds(
    latLng: BoundsLiteral,
    padding?: number | google.maps.Padding,
  ): Promise<void> {
    const map = await this._api;
    return map.panToBounds(latLng, padding);
  }

  /**
   * Triggers the given event name on the map instance.
   */
  triggerMapEvent(eventName: string): Promise<void> {
    return this._api.then((m) => google.maps.event.trigger(m, eventName));
  }

  protected _isLatLngBoundsLiteral(
    bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
  ): bounds is google.maps.LatLngBoundsLiteral {
    return bounds != null && (bounds as any).extend === undefined;
  }
}
