import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import {
  BoundsLiteral,
  CircleOptions,
  GeoPoint,
  MapOptions,
  MapsAPILoader,
  MapsApiWrapper,
  MarkerOptions,
  RectangleOptions,
} from '@ng-maps/core';

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
  constructor(_loader: MapsAPILoader, _zone: NgZone) {
    super(_loader, _zone);
  }

  protected override _api?: Promise<google.maps.Map>;
  protected override _mapResolver?: (value: google.maps.Map) => void;

  public createMap(
    el: HTMLElement,
    center: GeoPoint,
    options: MapOptions,
  ): Promise<void> {
    return this._zone.runOutsideAngular(async () => {
      await this._loader.load();
      if (this._mapResolver) {
        this._mapResolver(new google.maps.Map(el, { center, ...options }));
      }
      return;
    });
  }

  public async setMapOptions(options: google.maps.MapOptions) {
    const map = await this._api;
    map?.setOptions(options);
  }

  /**
   * Creates a google map drawing manager with the map context
   */
  public async createDrawingManager(
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
  public async createMarker(
    position: GeoPoint,
    options: MarkerOptions,
    addToMap: boolean = true,
  ): Promise<google.maps.Marker> {
    const map = addToMap ? await this._api : null;
    return new google.maps.Marker({ position, map, ...options });
  }

  public async createInfoWindow(
    center: GeoPoint,
    options?: google.maps.InfoWindowOptions,
  ): Promise<google.maps.InfoWindow> {
    await this._api;
    return new google.maps.InfoWindow({ position: center, ...options });
  }

  /**
   * Creates a google.map.Circle for the current map.
   *
   * @todo check how to improve type casting
   */
  public async createCircle(
    center: GeoPoint,
    options: CircleOptions,
  ): Promise<google.maps.Circle> {
    const opt: google.maps.CircleOptions = {
      ...options,
      center,
      map: await this._api,
    };
    if (typeof opt.strokePosition === 'string') {
      opt.strokePosition = google.maps.StrokePosition[
        opt.strokePosition
      ] as any as google.maps.StrokePosition;
    }
    return new google.maps.Circle(opt);
  }

  /**
   * Creates a google.map.Rectangle for the current map.
   */
  public async createRectangle(
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

  public async createPolyline(
    options: google.maps.PolylineOptions,
  ): Promise<google.maps.Polyline> {
    return this.getNativeMap().then((map) => {
      const line = new google.maps.Polyline(options);
      if (map) {
        line.setMap(map);
      }
      return line;
    });
  }

  public createPolygon(
    options: google.maps.PolygonOptions,
  ): Promise<google.maps.Polygon> {
    return this.getNativeMap().then((map) => {
      const polygon = new google.maps.Polygon(options);
      if (map) {
        polygon.setMap(map);
      }
      return polygon;
    });
  }

  /**
   * Creates a new google.map.Data layer for the current map
   */
  public async createDataLayer(
    options?: google.maps.Data.DataOptions,
  ): Promise<google.maps.Data | undefined> {
    return this._api?.then((m) => {
      const data = new google.maps.Data(options);
      data.setMap(m);
      return data;
    });
  }

  /**
   * Determines if given coordinates are insite a Polygon path.
   */
  public containsLocation(
    latLng: google.maps.LatLng,
    polygon: google.maps.Polygon,
  ): boolean {
    return google.maps.geometry.poly.containsLocation(latLng, polygon);
  }

  /**
   * @fixme typings
   */
  public subscribeToMapEvent(eventName: string): Observable<any> {
    return new Observable((observer) => {
      this._api?.then((m) =>
        m.addListener(eventName, (...evArgs: Array<any>) =>
          this._zone.run(() => observer.next(evArgs)),
        ),
      );
    });
  }

  public clearInstanceListeners() {
    this._api?.then((map: google.maps.Map) => {
      google.maps.event.clearInstanceListeners(map);
    });
  }

  public async setCenter(latLng: google.maps.LatLngLiteral): Promise<void> {
    return this._api?.then((map: google.maps.Map) => map.setCenter(latLng));
  }

  public async getZoom(): Promise<number | undefined> {
    const map = await this._api;
    return map?.getZoom();
  }

  public async getBounds(): Promise<BoundsLiteral | undefined> {
    const map = await this._api;
    return map?.getBounds()?.toJSON();
  }

  public async getMapTypeId(): Promise<
    google.maps.MapTypeId | string | undefined
  > {
    return this._api?.then((map) => map.getMapTypeId());
  }

  public async setZoom(zoom: number): Promise<void> {
    this._api?.then((map) => map.setZoom(zoom));
  }

  public async getCenter(): Promise<GeoPoint | undefined> {
    const map = await this._api;
    return map?.getCenter()?.toJSON();
  }

  public async panTo(
    latLng: google.maps.LatLng | google.maps.LatLngLiteral,
  ): Promise<void> {
    this._api?.then((map) => map.panTo(latLng));
  }

  public async panBy(x: number, y: number): Promise<void> {
    this._api?.then((map) => map.panBy(x, y));
  }

  public async fitBounds(
    latLng: BoundsLiteral,
    padding?: number | google.maps.Padding,
  ): Promise<void> {
    const map = await this._api;
    map?.fitBounds(latLng, padding);
  }

  public async panToBounds(
    latLng: BoundsLiteral,
    padding?: number | google.maps.Padding,
  ): Promise<void> {
    const map = await this._api;
    return map?.panToBounds(latLng, padding);
  }

  /**
   * Triggers the given event name on the map instance.
   */
  public async triggerMapEvent(eventName: string): Promise<void> {
    const map = await this._api;
    if (map) {
      google.maps.event.trigger(map, eventName);
    }
  }

  protected _isLatLngBoundsLiteral(
    bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
  ): bounds is google.maps.LatLngBoundsLiteral {
    return bounds != null && (bounds as any).extend === undefined;
  }
}
