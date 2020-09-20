import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { BoundsLiteral } from '../interface/bounds';
import { CircleOptions } from '../interface/circle-options';
import { GeoPoint } from '../interface/geo-point';
import { MapOptions } from '../interface/map-options';
import { MarkerOptions } from '../interface/marker-options';
import { Padding } from '../interface/padding';
import { RectangleOptions } from '../interface/rectangle-options';
import { MapsAPILoader } from './maps-api-loader/maps-api-loader';

@Injectable()
export abstract class MapsApiWrapper<T = any, C = any, R = any, I = any> {
  protected _api: Promise<T>;
  protected _mapResolver: (value?: T) => void;

  constructor(protected _loader: MapsAPILoader, protected _zone: NgZone) {
    this._api = new Promise<T>((resolve: () => void) => {
      this._mapResolver = resolve;
    });
  }

  public abstract createMap(
    el: HTMLElement,
    center: GeoPoint,
    options: MapOptions,
  );

  public abstract async setMapOptions(options: MapOptions);

  public abstract async createMarker(
    position: GeoPoint,
    options?: MarkerOptions,
    addToMap?: boolean,
  ): Promise<any>;

  public abstract clearInstanceListeners(): void;

  public async getNativeMap(): Promise<T> {
    return this._api;
  }

  public abstract async triggerMapEvent(eventName: string): Promise<void>;

  public abstract async getCenter(): Promise<GeoPoint>;

  public abstract setCenter(newCenter: GeoPoint): Promise<void>;

  public abstract panTo(newCenter: GeoPoint): Promise<void>;

  public abstract panToBounds(
    bounds: BoundsLiteral,
    boundsPadding?: number | Padding,
  );

  public abstract fitBounds(
    bounds: BoundsLiteral,
    boundsPadding?: number | Padding,
  );

  public abstract getBounds(): Promise<BoundsLiteral>;

  public abstract async getZoom(): Promise<number>;

  public abstract async setZoom(zoom: number): Promise<any>;

  public abstract async getMapTypeId(): Promise<google.maps.MapTypeId | string>;

  public abstract subscribeToMapEvent(eventName: string): Observable<any>;

  public abstract async createInfoWindow(
    center: GeoPoint,
    options: any,
  ): Promise<I>;

  public abstract async createDrawingManager(param: any, addToMap?: boolean);

  public abstract async createCircle(
    center: GeoPoint,
    options: CircleOptions,
  ): Promise<C>;

  public abstract async createRectangle(
    box: BoundsLiteral,
    options: RectangleOptions,
  ): Promise<R>;

  public abstract async createPolyline(options: any): Promise<any>;

  public abstract async createPolygon(options: any): Promise<any>;
}
