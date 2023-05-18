import { Inject, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import {
  BoundsLiteral,
  CircleOptions,
  GeoPoint,
  MapOptions,
  MapsAPILoader,
  MapsApiWrapper,
  MarkerOptions,
  Padding,
  RectangleOptions,
} from '@ng-maps/core';

import { boundsFromRect, rectFromBounds } from './convert';
import { HereMapsPlatformProvider } from './here-maps-platform.provider';
import {
  HereMapsLibraries,
  HereModuleOptions,
  HERE_MAPS_MODULE_OPTIONS,
} from './options';

@Injectable()
export class HereMapsWrapperService extends MapsApiWrapper<H.Map> {
  private defaultLayers: H.service.DefaultLayers;
  private _ui: BehaviorSubject<H.ui.UI> = new BehaviorSubject(null);
  public readonly ui$: Observable<H.ui.UI>;

  constructor(
    @Inject(HERE_MAPS_MODULE_OPTIONS)
    private options: HereModuleOptions | any,
    private platformProvider: HereMapsPlatformProvider,
    _loader: MapsAPILoader,
    _zone: NgZone,
  ) {
    super(_loader, _zone);
    this.ui$ = this._ui.asObservable();
  }

  get ui() {
    return this._ui
      .pipe(
        filter((ui) => ui != null),
        take(1),
      )
      .toPromise();
  }

  async createCircle(
    center: GeoPoint,
    options: CircleOptions,
  ): Promise<H.map.Circle> {
    const map = await this.getNativeMap();
    // Instantiate a circle object (using the default style):
    const style = new H.map.SpatialStyle({
      ...options,
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
    await this.platformProvider.getPlatform();
    if (this._ui.value != null) {
      // Create an info bubble object at a specific geographic location:
      const bubble = new H.ui.InfoBubble(center, options);
      bubble.setState(H.ui.InfoBubble.State.CLOSED);
      // Add info bubble to the UI:
      this._ui.value.addBubble(bubble);
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

  async createMap(el: HTMLElement, center: GeoPoint, options: MapOptions) {
    const platform = await this.platformProvider.getPlatform();
    this.defaultLayers = platform.createDefaultLayers();
    const map = new H.Map(el, this.defaultLayers.vector.normal.map, {
      ...options,
      center,
      fixedCenter: false,
    });
    this._mapResolver(map);
    await this.updateBehaviour(options);
    const libraries = (await this.options).libraries;
    if (libraries.includes(HereMapsLibraries.UI)) {
      this._ui.next(H.ui.UI.createDefault(map, this.defaultLayers));
    }
  }

  private async updateBehaviour(options: MapOptions) {
    const map = await this.getNativeMap();
    if (H.mapevents) {
      const mapEvents = new H.mapevents.MapEvents(map);
      const behavior = new H.mapevents.Behavior(mapEvents);
      if (options) {
        if (options.scrollwheel) {
          behavior.enable(H.mapevents.Behavior.WHEELZOOM);
        } else {
          behavior.disable(H.mapevents.Behavior.WHEELZOOM);
        }
        if (options.disableDoubleClickZoom) {
          behavior.disable(H.mapevents.Behavior.DBLTAPZOOM);
        } else {
          behavior.enable(H.mapevents.Behavior.DBLTAPZOOM);
        }
        if (options.draggable) {
          behavior.enable(H.mapevents.Behavior.DRAGGING);
        } else {
          behavior.disable(H.mapevents.Behavior.DRAGGING);
        }
      }
    } else {
      throw new Error('You need to add mapevents to your libraries');
    }
  }

  private async updateUi(options: MapOptions) {
    const ui = await this.ui;
    if (options && ui) {
      ui.getControl('mapsettings').setVisibility(options.mapTypeControl);
      ui.getControl('zoom').setVisibility(options.zoomControl);
      ui.getControl('scalebar').setVisibility(options.scaleControl);
      if ((H as any).PanoramaView) {
        ui.getControl('panorama').setVisibility(options.streetViewControl);
      }
    } else {
      throw new Error('You need to add ui to your libraries');
    }
  }

  async createMarker(
    { lat, lng }: GeoPoint,
    options: MarkerOptions,
    addToMap: boolean = true,
  ): Promise<H.map.Marker> {
    const map = await this.getNativeMap();
    let opts: H.map.Marker.Options;
    if (options) {
      opts = {
        visibility: options.visible,
        zIndex: options.zIndex,
      };
    }

    const m = new H.map.Marker({ lat, lng }, opts);
    if (addToMap) {
      map.addObject(m);
    }
    return m;
  }

  setMapOptions(options: any): any {
    this.updateUi(options);
  }
}
