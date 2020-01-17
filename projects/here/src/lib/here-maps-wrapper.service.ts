import { Injectable } from '@angular/core';
import { BoundsLiteral, MapsApiWrapper, MarkerOptions } from '@ng-maps/core';
import { EMPTY, Observable } from 'rxjs';
import { boundsFromRect } from './convert';

@Injectable()
export class HereMapsWrapperService extends MapsApiWrapper<H.Map> {
  private platform: H.service.Platform;
  private defaultLayers: any;

  async createCircle(options: any): Promise<H.map.Circle> {
    const map = await this.getNativeMap();
    // Instantiate a circle object (using the default style):
    const { lat, lng } = options.center;
    const circle = new H.map.Circle({ lat, lng }, options.radius);

    // Add the circle to the map:
    map.addObject(circle);
    return circle;
  }

  async createPolygon(options: any): Promise<any> {
    return undefined;
  }

  async createPolyline(options: any): Promise<any> {
    return undefined;
  }

  async createRectangle(options: any): Promise<any> {
    return undefined;
  }

  createDrawingManager(param: any, addToMap: boolean): any {}

  clearInstanceListeners(): void {}

  createInfoWindow(
    options: google.maps.InfoWindowOptions,
  ): Promise<google.maps.InfoWindow> {
    return undefined;
  }

  fitBounds(
    bounds: BoundsLiteral,
    boundsPadding: number | google.maps.Padding,
  ): any {}

  async getBounds(): Promise<BoundsLiteral> {
    const map = await this.getNativeMap();
    const bounds = map.getViewBounds();
    return boundsFromRect(bounds);
  }

  async getCenter(): Promise<any> {
    const map = await this.getNativeMap();
    return map.getCenter();
  }

  getMapTypeId(): Promise<google.maps.MapTypeId | string> {
    return undefined;
  }

  async getZoom(): Promise<number> {
    const map = await this.getNativeMap();
    return map.getZoom();
  }

  panTo(newCenter: { lng: number; lat: number }): Promise<void> {
    return undefined;
  }

  panToBounds(
    bounds: BoundsLiteral,
    boundsPadding: number | google.maps.Padding,
  ): any {}

  async setCenter(newCenter: { lng: number; lat: number }): Promise<void> {
    const map = await this.getNativeMap();
    map.setCenter(newCenter);
  }

  async setZoom(zoom: number): Promise<H.Map> {
    const map = await this.getNativeMap();
    return map.setZoom(zoom);
  }

  subscribeToMapEvent<E>(eventName: string): Observable<E> {
    return EMPTY;
  }

  triggerMapEvent(eventName: string): Promise<void> {
    return undefined;
  }

  createMap(el: HTMLElement, options?: H.Map.Options) {
    return this._zone.runOutsideAngular(async () => {
      await this._loader.load();
      this.createPlatform();
      this._mapResolver(
        new H.Map(el, this.defaultLayers.vector.normal.map, options),
      );
      return;
    });
  }

  async createMarker(options: MarkerOptions): Promise<H.map.Marker> {
    const map = await this.getNativeMap();
    const { lat, lng } = options.position;
    const opts: H.map.Marker.Options = {
      visibility: options.visible,
      zIndex: options.zIndex,
    };
    const m = new H.map.Marker({ lat, lng }, opts);
    map.addObject(m);
    return m;
  }

  setMapOptions(options: any): any {}

  private createPlatform() {
    // Create a Platform object (one per application):
    this.platform = new H.service.Platform({
      app_id: 'SU2sKxocvnItjhSLqpe2',
      apikey: 'NIetcbVFNgfAE7pK2CPNf5hqXiBVNyIfNgFqZha1BL4',
    } as any);

    // Get an object containing the default map layers:
    this.defaultLayers = this.platform.createDefaultLayers();
  }
}
