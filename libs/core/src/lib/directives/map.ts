import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { BoundsLiteral } from '../interface/bounds';
import { GeoPoint } from '../interface/geo-point';
import { LayerTypes } from '../interface/layers';
import { MapOptions } from '../interface/map-options';
import { Padding } from '../interface/padding';
import { FitBoundsService } from '../services/fit-bounds';
import { MapsApiWrapper } from '../services/maps-api-wrapper';

/**
 * NgMapsViewComponent renders a Google Map.
 * **Important note**: To be able see a map in the browser, you have to define a height for the
 * element `map-view`.
 *
 * @example
 * <map-view [latitude]="lat" [longitude]="lng" [zoom]="zoom"></map-view>
 */
@Component({
  styles: [
    `
      .map-container-inner {
        width: inherit;
        height: inherit;
      }

      .map-content {
        display: none;
      }
    `,
  ],
  template: `
    <div class="map-container-inner" #container></div>
    <div class="map-content">
      <ng-content></ng-content>
    </div>
  `,
})
export class NgMapsViewComponent<T>
  implements OnChanges, OnInit, OnDestroy, MapOptions
{
  constructor(
    protected _mapsWrapper: MapsApiWrapper<T>,
    protected _fitBoundsService: FitBoundsService,
    protected _zone: NgZone,
  ) {}

  /**
   * Map option attributes that can change over time
   */
  private static _mapOptionsAttributes: Array<string> = [
    'disableDoubleClickZoom',
    'scrollwheel',
    'draggable',
    'draggableCursor',
    'draggingCursor',
    'keyboardShortcuts',
    'zoomControl',
    'zoomControlOptions',
    'styles',
    'streetViewControl',
    'streetViewControlOptions',
    'zoom',
    'mapTypeControl',
    'mapTypeControlOptions',
    'minZoom',
    'maxZoom',
    'panControl',
    'panControlOptions',
    'rotateControl',
    'rotateControlOptions',
    'fullscreenControl',
    'fullscreenControlOptions',
    'scaleControl',
    'scaleControlOptions',
    'mapTypeId',
    'clickableIcons',
    'gestureHandling',
    'tilt',
  ];
  /**
   * The longitude that defines the center of the map.
   */
  @Input() public longitude: number = 0;

  /**
   * The latitude that defines the center of the map.
   */
  @Input() public latitude: number = 0;

  /**
   * The zoom level of the map. The default zoom level is 8.
   */
  @Input() public zoom: number = 8;

  /**
   * The minimal zoom level of the map allowed. When not provided, no restrictions to the zoom level
   * are enforced.
   */
  @Input() public minZoom?: number;

  /**
   * The maximal zoom level of the map allowed. When not provided, no restrictions to the zoom level
   * are enforced.
   */
  @Input() public maxZoom?: number;

  /**
   * Enables/disables if map is draggable.
   */
  @Input() public draggable: boolean = true;

  /**
   * Enables/disables zoom and center on double click. Enabled by default.
   */
  @Input() public disableDoubleClickZoom: boolean = false;

  /**
   * Enables/disables all default UI of the Google map. Please note: When the map is created, this
   * value cannot get updated.
   */
  @Input() public disableDefaultUI: boolean = false;

  /**
   * If false, disables scrollwheel zooming on the map. The scrollwheel is enabled by default.
   */
  @Input() public scrollwheel: boolean = true;

  /**
   * Color used for the background of the Map div. This color will be visible when tiles have not
   * yet loaded as the user pans. This option can only be set when the map is initialized.
   */
  @Input() public backgroundColor?: string;

  /**
   * The name or url of the cursor to display when mousing over a draggable map. This property uses
   * the css  * cursor attribute to change the icon. As with the css property, you must specify at
   * least one fallback cursor that is not a URL. For example:
   * [draggableCursor]="'url(http://www.example.com/icon.png), auto;'"
   */
  @Input() public draggableCursor?: string;

  /**
   * The name or url of the cursor to display when the map is being dragged. This property uses the
   * css cursor attribute to change the icon. As with the css property, you must specify at least
   * one fallback cursor that is not a URL. For example:
   * [draggingCursor]="'url(http://www.example.com/icon.png), auto;'"
   */
  @Input() public draggingCursor?: string;

  /**
   * If false, prevents the map from being controlled by the keyboard. Keyboard shortcuts are
   * enabled by default.
   */
  @Input() public keyboardShortcuts: boolean = true;

  /**
   * The enabled/disabled state of the Zoom control.
   */
  @Input() public zoomControl: boolean = true;

  /**
   * Options for the Zoom control.
   */
  @Input() public zoomControlOptions?: google.maps.ZoomControlOptions;

  /**
   * Styles to apply to each of the default map types. Note that for Satellite/Hybrid and Terrain
   * modes, these styles will only apply to labels and geometry.
   */
  @Input() public styles: Array<google.maps.MapTypeStyle> = [];

  /**
   * When true and the latitude and/or longitude values changes, the Google Maps panTo method is
   * used to
   * center the map. See: https://developers.google.com/maps/documentation/javascript/reference#Map
   */
  @Input() public usePanning: boolean = false;

  /**
   * The initial enabled/disabled state of the Street View Pegman control.
   * This control is part of the default UI, and should be set to false when displaying a map type
   * on which the Street View road overlay should not appear (e.g. a non-Earth map type).
   */
  @Input() public streetViewControl?: boolean;

  /**
   * Options for the Street View control.
   */
  @Input()
  public streetViewControlOptions?: google.maps.StreetViewControlOptions;

  /**
   * Sets the viewport to contain the given bounds.
   * If this option to `true`, the bounds get automatically computed from all elements that use the {@link NgMapsFitBounds} directive.
   */
  @Input() public fitBounds: BoundsLiteral | boolean = false;

  /**
   * Padding amount for bounds. This optional parameter is undefined by default.
   */
  @Input() public boundsPadding?: number | Padding;

  /**
   * The initial enabled/disabled state of the Scale control. This is disabled by default.
   */
  @Input() public scaleControl: boolean = true;

  /**
   * Options for the scale control.
   */
  @Input() public scaleControlOptions?: google.maps.ScaleControlOptions;

  /**
   * The initial enabled/disabled state of the Map type control.
   */
  @Input() public mapTypeControl: boolean = true;

  /**
   * Options for the Map type control.
   */
  @Input() public mapTypeControlOptions?: google.maps.MapTypeControlOptions;

  /**
   * The initial enabled/disabled state of the Pan control.
   */
  @Input() public panControl: boolean = false;

  /**
   * Options for the Pan control.
   */
  @Input() public panControlOptions?: google.maps.PanControlOptions;

  /**
   * The initial enabled/disabled state of the Rotate control.
   */
  @Input() public rotateControl: boolean = false;

  /**
   * Options for the Rotate control.
   */
  @Input() public rotateControlOptions?: google.maps.RotateControlOptions;

  /**
   * The initial enabled/disabled state of the Fullscreen control.
   */
  @Input() public fullscreenControl: boolean = false;

  /**
   * Options for the Fullscreen control.
   */
  @Input()
  public fullscreenControlOptions?: google.maps.FullscreenControlOptions;

  /**
   * The map mapTypeId. Defaults to 'roadmap'.
   */
  @Input() public mapTypeId:
    | 'roadmap'
    | 'hybrid'
    | 'satellite'
    | 'terrain'
    | string
    | google.maps.MapTypeId = 'roadmap';

  /**
   * Add layers https://developers.google.com/maps/documentation/javascript/trafficlayer to map
   */
  @Input() public layers?: Array<LayerTypes> | LayerTypes;

  private _layerInstance: Map<
    LayerTypes,
    | google.maps.TrafficLayer
    | google.maps.TransitLayer
    | google.maps.BicyclingLayer
  > = new Map();

  /**
   * When false, map icons are not clickable. A map icon represents a point of interest,
   * also known as a POI. By default map icons are clickable.
   */
  @Input() public clickableIcons: boolean = true;

  /**
   * This setting controls how gestures on the map are handled.
   * Allowed values:
   * - 'cooperative' (Two-finger touch gestures pan and zoom the map. One-finger touch gestures are not handled by the map.)
   * - 'greedy'      (All touch gestures pan or zoom the map.)
   * - 'none'        (The map cannot be panned or zoomed by user gestures.)
   * - 'auto'        [default] (Gesture handling is either cooperative or greedy, depending on whether the page is scrollable or not.
   */
  @Input() public gestureHandling: 'cooperative' | 'greedy' | 'none' | 'auto' =
    'auto';

  /**
   * Controls the automatic switching behavior for the angle of incidence of
   * the map. The only allowed values are 0 and 45. The value 0 causes the map
   * to always use a 0° overhead view regardless of the zoom level and
   * viewport. The value 45 causes the tilt angle to automatically switch to
   * 45 whenever 45° imagery is available for the current zoom level and
   * viewport, and switch back to 0 whenever 45° imagery is not available
   * (this is the default behavior). 45° imagery is only available for
   * satellite and hybrid map types, within some locations, and at some zoom
   * levels. Note: getTilt returns the current tilt angle, not the value
   * specified by this option. Because getTilt and this option refer to
   * different things, do not bind() the tilt property; doing so may yield
   * unpredictable effects. (Default of AGM is 0 (disabled). Enable it with value 45.)
   */
  @Input() public tilt: number = 0;

  protected subscription: Subscription = new Subscription();
  protected _fitBoundsSubscription?: Subscription;

  /**
   * This event emitter gets emitted when the user clicks on the map (but not when they click on a
   * marker or infoWindow).
   */
  @Output()
  public mapClick: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event emitter gets emitted when the user right-clicks on the map (but not when they click
   * on a marker or infoWindow).
   */
  @Output()
  public mapRightClick: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event emitter gets emitted when the user double-clicks on the map (but not when they click
   * on a marker or infoWindow).
   */
  @Output()
  public mapDblClick: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event emitter is fired when the map center changes.
   */
  @Output()
  public centerChange: EventEmitter<GeoPoint> = new EventEmitter<GeoPoint>();

  /**
   * This event is fired when the viewport bounds have changed.
   */
  @Output()
  public boundsChange: EventEmitter<BoundsLiteral> =
    new EventEmitter<BoundsLiteral>();

  /**
   * This event is fired when the mapTypeId property changes.
   */
  @Output()
  public mapTypeIdChange: EventEmitter<google.maps.MapTypeId | string> =
    new EventEmitter<google.maps.MapTypeId | string>();

  /**
   * This event is fired when the map becomes idle after panning or zooming.
   */
  @Output() public idle: EventEmitter<void> = new EventEmitter<void>();

  /**
   * This event is fired when the zoom level has changed.
   */
  @Output()
  public zoomChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * This event is fired when the google map is fully initialized.
   * You get the google.maps.Map instance as a result of this EventEmitter.
   */
  @Output() public mapReady: EventEmitter<T> = new EventEmitter<T>();

  /**
   * This event is fired when the visible tiles have finished loading.
   */
  @Output() public tilesLoaded: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('container', { static: true }) public container?: ElementRef;

  /** @internal */
  public ngOnInit() {
    this._initMapInstance(this.container?.nativeElement);
  }

  protected async _initMapInstance(el: HTMLElement) {
    await this._mapsWrapper.createMap(
      el,
      { lat: this.latitude || 0, lng: this.longitude || 0 },
      {
        zoom: this.zoom,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        disableDefaultUI: this.disableDefaultUI,
        disableDoubleClickZoom: this.disableDoubleClickZoom,
        scrollwheel: this.scrollwheel,
        backgroundColor: this.backgroundColor,
        draggable: this.draggable,
        draggableCursor: this.draggableCursor,
        draggingCursor: this.draggingCursor,
        keyboardShortcuts: this.keyboardShortcuts,
        styles: this.styles,
        zoomControl: this.zoomControl,
        zoomControlOptions: this.zoomControlOptions,
        streetViewControl: this.streetViewControl,
        streetViewControlOptions: this.streetViewControlOptions,
        scaleControl: this.scaleControl,
        scaleControlOptions: this.scaleControlOptions,
        mapTypeControl: this.mapTypeControl,
        mapTypeControlOptions: this.mapTypeControlOptions,
        panControl: this.panControl,
        panControlOptions: this.panControlOptions,
        rotateControl: this.rotateControl,
        rotateControlOptions: this.rotateControlOptions,
        fullscreenControl: this.fullscreenControl,
        fullscreenControlOptions: this.fullscreenControlOptions,
        mapTypeId: this.mapTypeId as google.maps.MapTypeId,
        clickableIcons: this.clickableIcons,
        gestureHandling: this.gestureHandling,
        tilt: this.tilt,
      },
    );
    const map = await this._mapsWrapper.getNativeMap();
    this.mapReady.emit(map);

    // register event listeners
    this._handleMapCenterChange();
    this._handleMapZoomChange();
    this._handleMapMouseEvents();
    this._handleBoundsChange();
    this._handleMapTypeIdChange();
    this._handleTilesLoadedEvent();
    this._handleIdleEvent();
  }

  protected _handleIdleEvent() {
    throw new Error('Method not implemented.');
  }

  protected _handleTilesLoadedEvent() {
    throw new Error('Method not implemented.');
  }

  protected _handleMapTypeIdChange() {
    throw new Error('Method not implemented.');
  }

  protected _handleBoundsChange() {
    throw new Error('Method not implemented.');
  }

  protected _handleMapMouseEvents() {
    throw new Error('Method not implemented.');
  }

  protected _handleMapZoomChange() {
    throw new Error('Method not implemented.');
  }

  protected _handleMapCenterChange() {
    throw new Error('Method not implemented.');
  }

  /** @internal */
  public ngOnDestroy() {
    // unsubscribe all registered observable subscriptions
    this.subscription.unsubscribe();

    // remove all listeners from the map instance
    this._mapsWrapper.clearInstanceListeners();
    if (this._fitBoundsSubscription) {
      this._fitBoundsSubscription.unsubscribe();
    }
  }

  /* @internal */
  public ngOnChanges(changes: SimpleChanges) {
    this._updateMapOptionsChanges(changes);
    this._updatePosition(changes);
    this._layerChanges(changes);
  }

  protected _updateMapOptionsChanges(changes: SimpleChanges) {
    const options: SimpleChanges = {};
    const optionKeys = Object.keys(changes).filter((k) =>
      NgMapsViewComponent._mapOptionsAttributes.includes(k),
    );
    optionKeys.forEach((k) => {
      options[k] = changes[k].currentValue;
    });
    return this._mapsWrapper.setMapOptions(options);
  }

  /**
   * @todo google specific
   * @param changes
   * @protected
   */
  protected async _layerChanges(changes: SimpleChanges) {
    if (changes.layers) {
      const map = await this._mapsWrapper.getNativeMap();
      const layers = Array.isArray(this.layers) ? this.layers : [this.layers];
      layers.forEach((layer) => {
        if (layer && !this._layerInstance.has(layer)) {
          const i:
            | google.maps.TrafficLayer
            | google.maps.TransitLayer
            | google.maps.BicyclingLayer = new google.maps[layer]();
          // @todo typings
          i.setMap(map as any as google.maps.Map);
          this._layerInstance.set(layer, i);
        }
      });
      Array.from(this._layerInstance.keys()).forEach((layer) => {
        if (!layers.includes(layer)) {
          const i = this._layerInstance.get(layer);
          i?.setMap(null);
          this._layerInstance.delete(layer);
        }
      });
    }
  }

  /**
   * Triggers a resize event on the google map instance.
   * When recenter is true, the of the google map gets called with the current lat/lng values or fitBounds value to recenter the map.
   * Returns a promise that gets resolved after the event was triggered.
   */
  public triggerResize(recenter: boolean = true): Promise<void> {
    // Note: When we would trigger the resize event and show the map in the same turn (which is a
    // common case for triggering a resize event), then the resize event would not
    // work (to show the map), so we trigger the event in a timeout.
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        await this._mapsWrapper.triggerMapEvent('resize');
        if (recenter) {
          this.fitBounds != null ? this._fitBounds() : this._setCenter();
        }
        resolve();
      });
    });
  }

  protected async _updatePosition(changes: SimpleChanges) {
    if (
      changes.latitude == null &&
      changes.longitude == null &&
      !changes.fitBounds
    ) {
      // no position update needed
      return;
    }

    // we prefer fitBounds in changes
    if ('fitBounds' in changes) {
      await this._fitBounds();
      return;
    }
    if (typeof this.latitude === 'string') {
      this.latitude = parseFloat(this.latitude);
    }
    if (typeof this.longitude === 'string') {
      this.longitude = parseFloat(this.longitude);
    }
    const center = await this._mapsWrapper.getCenter();
    if (
      !(
        typeof this.latitude !== 'number' || typeof this.longitude !== 'number'
      ) &&
      this.latitude !== center?.lat &&
      this.longitude !== center?.lng
    ) {
      await this._setCenter();
      return;
    }
  }

  protected _setCenter() {
    const newCenter = {
      lat: this.latitude,
      lng: this.longitude,
    };
    if (this.usePanning) {
      return this._mapsWrapper.panTo(newCenter);
    } else {
      return this._mapsWrapper.setCenter(newCenter);
    }
  }

  protected async _fitBounds() {
    switch (this.fitBounds) {
      case true:
        this._subscribeToFitBoundsUpdates();
        break;
      case false:
        if (this._fitBoundsSubscription) {
          this._fitBoundsSubscription.unsubscribe();
        }
        break;
      default:
        if (this._fitBoundsSubscription) {
          this._fitBoundsSubscription.unsubscribe();
        }
        return this._updateBounds(this.fitBounds);
    }
  }

  protected _subscribeToFitBoundsUpdates() {
    this._zone.runOutsideAngular(() => {
      this._fitBoundsSubscription = this._fitBoundsService
        .getBounds$()
        .subscribe((b) => this._zone.run(() => this._updateBounds(b)));
    });
  }

  protected async _updateBounds(bounds: BoundsLiteral) {
    if (bounds != null) {
      /**
       * await map to not update bounds till map is initialized
       */
      await this._mapsWrapper.getNativeMap();
      if (this.usePanning) {
        return this._mapsWrapper.panToBounds(bounds, this.boundsPadding);
      } else {
        return this._mapsWrapper.fitBounds(bounds, this.boundsPadding);
      }
    }
  }
}
