import { Inject, Injectable, NgZone } from '@angular/core';
import {
  BoundsLiteral,
  CircleOptions,
  GeoPoint,
  MapsAPILoader,
  MapsApiWrapper,
  MarkerOptions,
  Padding,
  RectangleOptions,
} from '@ng-maps/core';
import { Observable } from 'rxjs';
import { boundsFromRect, rectFromBounds } from './convert';
import {
  HERE_MAPS_MODULE_OPTIONS,
  HereMapsLibraries,
  HereModuleOptions,
} from './options';

@Injectable()
export class HereMapsWrapperService extends MapsApiWrapper<H.Map> {
  private platform: H.service.Platform;
  private defaultLayers: any;
  private ui: H.ui.UI;

  constructor(
    @Inject(HERE_MAPS_MODULE_OPTIONS) private options: HereModuleOptions,
    _loader: MapsAPILoader,
    _zone: NgZone,
  ) {
    super(_loader, _zone);
  }

  async createCircle(
    center: GeoPoint,
    options: CircleOptions,
  ): Promise<H.map.Circle> {
    const map = await this.getNativeMap();
    // Instantiate a circle object (using the default style):
    const style = new H.map.SpatialStyle({
      fillColor: options.fillColor,
      strokeColor: options.strokeColor,
      lineWidth: options.strokeWeight,
    });
    const circle = new H.map.Circle(center, options.radius, {
      zIndex: options.zIndex,
      visibility: options.visible,
      style,
    });
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

  async createRectangle(
    bounds: BoundsLiteral,
    options: RectangleOptions,
  ): Promise<any> {
    const map = await this.getNativeMap();
    const style = new H.map.SpatialStyle({
      fillColor: options.fillColor,
      strokeColor: options.strokeColor,
      lineWidth: options.strokeWeight,
    });
    const rect = new H.map.Rect(rectFromBounds(bounds), {
      zIndex: options.zIndex,
      visibility: options.visible,
      style,
    });
    // Add the rectangle to map
    map.addObject(rect);
    return rect;
  }

  createDrawingManager(param: any, addToMap: boolean): any {}

  clearInstanceListeners(): void {}

  async createInfoWindow(
    center: GeoPoint,
    options: H.ui.InfoBubble.Options,
  ): Promise<H.ui.InfoBubble> {
    if (this.ui != null) {
      // Create an info bubble object at a specific geographic location:
      const bubble = new H.ui.InfoBubble(center, options);

      // Add info bubble to the UI:
      this.ui.addBubble(bubble);
      return bubble;
    } else {
      throw new Error(
        'Add HereMapsLibraries.UI to NgMapsHereModule.forRoot() libraries',
      );
    }
  }

  /**
   * @todo implement padding
   * @param bounds
   * @param boundsPadding
   */
  async fitBounds(
    bounds: BoundsLiteral,
    boundsPadding?: number | Padding,
  ): Promise<void> {
    const map = await this.getNativeMap();
    const box = rectFromBounds(bounds);
    map.getViewModel().setLookAtData({ bounds: box });
  }

  async getBounds(): Promise<BoundsLiteral> {
    const map = await this.getNativeMap();
    const lookAtData = map.getViewModel().getLookAtData();
    return boundsFromRect(lookAtData.bounds.getBoundingBox());
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

  async panTo(newCenter: { lng: number; lat: number }): Promise<void> {
    const map = await this.getNativeMap();
    map.setCenter(newCenter, true);
  }

  /**
   * @todo implement padding
   * @param bounds
   * @param boundsPadding
   */
  async panToBounds(
    bounds: BoundsLiteral,
    boundsPadding?: number | Padding,
  ): Promise<void> {
    const map = await this.getNativeMap();
    const box = rectFromBounds(bounds);
    map.getViewModel().setLookAtData({ bounds: box }, true);
  }

  async setCenter(newCenter: { lng: number; lat: number }): Promise<void> {
    const map = await this.getNativeMap();
    map.setCenter(newCenter);
  }

  async setZoom(zoom: number): Promise<H.Map> {
    const map = await this.getNativeMap();
    return map.setZoom(zoom);
  }

  subscribeToMapEvent<E>(eventName: string): Observable<E> {
    return new Observable((observer) => {
      this._api.then((m: H.Map) => {
        m.addEventListener(eventName, (arg: Event) => {
          this._zone.run(() => observer.next(arg as any));
        });
      });
    });
  }

  triggerMapEvent(eventName: string): Promise<void> {
    return undefined;
  }

  createMap(el: HTMLElement, options?: H.Map.Options) {
    return this._zone.runOutsideAngular(async () => {
      await this._loader.load();
      this.createPlatform();
      const map = new H.Map(el, this.defaultLayers.vector.normal.map, options);
      this._mapResolver(map);
      if (this.options.libraries.includes(HereMapsLibraries.UI)) {
        this.ui = H.ui.UI.createDefault(map, this.defaultLayers);
      }
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
    this.platform = new H.service.Platform(this.options.platformOptions);

    // Get an object containing the default map layers:
    this.defaultLayers = this.platform.createDefaultLayers();
  }
}
