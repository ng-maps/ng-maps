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
import { LayerTypes } from '../interface/layers';
import { FitBoundsService } from '../services/fit-bounds';
import { GoogleMapsAPIWrapper } from '../services/google-maps-api-wrapper';
import { MarkerManager } from '../services/managers/marker-manager';

/**
 * NgMapsViewComponent renders a Google Map.
 * **Important note**: To be able see a map in the browser, you have to define a height for the
 * element `map-view`.
 *
 * @example
 * <map-view [latitude]="lat" [longitude]="lng" [zoom]="zoom"></map-view>
 */
@Component({
  selector: 'agm-map, map-view',
  providers: [GoogleMapsAPIWrapper, FitBoundsService, MarkerManager],
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
export class NgMapsViewComponent implements OnChanges, OnInit, OnDestroy {
  constructor(
    protected _mapsWrapper: GoogleMapsAPIWrapper,
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
  @Input() longitude: number = 0;

  /**
   * The latitude that defines the center of the map.
   */
  @Input() latitude: number = 0;

  /**
   * The zoom level of the map. The default zoom level is 8.
   */
  @Input() zoom: number = 8;

  /**
   * The minimal zoom level of the map allowed. When not provided, no restrictions to the zoom level
   * are enforced.
   */
  @Input() minZoom: number;

  /**
   * The maximal zoom level of the map allowed. When not provided, no restrictions to the zoom level
   * are enforced.
   */
  @Input() maxZoom: number;

  /**
   * Enables/disables if map is draggable.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('mapDraggable') draggable: boolean = true;

  /**
   * Enables/disables zoom and center on double click. Enabled by default.
   */
  @Input() disableDoubleClickZoom: boolean = false;

  /**
   * Enables/disables all default UI of the Google map. Please note: When the map is created, this
   * value cannot get updated.
   */
  @Input() disableDefaultUI: boolean = false;

  /**
   * If false, disables scrollwheel zooming on the map. The scrollwheel is enabled by default.
   */
  @Input() scrollwheel: boolean = true;

  /**
   * Color used for the background of the Map div. This color will be visible when tiles have not
   * yet loaded as the user pans. This option can only be set when the map is initialized.
   */
  @Input() backgroundColor: string;

  /**
   * The name or url of the cursor to display when mousing over a draggable map. This property uses
   * the css  * cursor attribute to change the icon. As with the css property, you must specify at
   * least one fallback cursor that is not a URL. For example:
   * [draggableCursor]="'url(http://www.example.com/icon.png), auto;'"
   */
  @Input() draggableCursor: string;

  /**
   * The name or url of the cursor to display when the map is being dragged. This property uses the
   * css cursor attribute to change the icon. As with the css property, you must specify at least
   * one fallback cursor that is not a URL. For example:
   * [draggingCursor]="'url(http://www.example.com/icon.png), auto;'"
   */
  @Input() draggingCursor: string;

  /**
   * If false, prevents the map from being controlled by the keyboard. Keyboard shortcuts are
   * enabled by default.
   */
  @Input() keyboardShortcuts: boolean = true;

  /**
   * The enabled/disabled state of the Zoom control.
   */
  @Input() zoomControl: boolean;

  /**
   * Options for the Zoom control.
   */
  @Input() zoomControlOptions: google.maps.ZoomControlOptions;

  /**
   * Styles to apply to each of the default map types. Note that for Satellite/Hybrid and Terrain
   * modes, these styles will only apply to labels and geometry.
   */
  @Input() styles: Array<google.maps.MapTypeStyle> = [];

  /**
   * When true and the latitude and/or longitude values changes, the Google Maps panTo method is
   * used to
   * center the map. See: https://developers.google.com/maps/documentation/javascript/reference#Map
   */
  @Input() usePanning: boolean = false;

  /**
   * The initial enabled/disabled state of the Street View Pegman control.
   * This control is part of the default UI, and should be set to false when displaying a map type
   * on which the Street View road overlay should not appear (e.g. a non-Earth map type).
   */
  @Input() streetViewControl: boolean;

  /**
   * Options for the Street View control.
   */
  @Input() streetViewControlOptions: google.maps.StreetViewControlOptions;

  /**
   * Sets the viewport to contain the given bounds.
   * If this option to `true`, the bounds get automatically computed from all elements that use the {@link NgMapsFitBounds} directive.
   */
  @Input() fitBounds:
    | google.maps.LatLngBoundsLiteral
    | google.maps.LatLngBounds
    | boolean = false;

  /**
   * Padding amount for bounds. This optional parameter is undefined by default.
   */
  @Input() boundsPadding: number | google.maps.Padding;

  /**
   * The initial enabled/disabled state of the Scale control. This is disabled by default.
   */
  @Input() scaleControl: boolean = false;

  /**
   * Options for the scale control.
   */
  @Input() scaleControlOptions: google.maps.ScaleControlOptions;

  /**
   * The initial enabled/disabled state of the Map type control.
   */
  @Input() mapTypeControl: boolean = false;

  /**
   * Options for the Map type control.
   */
  @Input() mapTypeControlOptions: google.maps.MapTypeControlOptions;

  /**
   * The initial enabled/disabled state of the Pan control.
   */
  @Input() panControl: boolean = false;

  /**
   * Options for the Pan control.
   */
  @Input() panControlOptions: google.maps.PanControlOptions;

  /**
   * The initial enabled/disabled state of the Rotate control.
   */
  @Input() rotateControl: boolean = false;

  /**
   * Options for the Rotate control.
   */
  @Input() rotateControlOptions: google.maps.RotateControlOptions;

  /**
   * The initial enabled/disabled state of the Fullscreen control.
   */
  @Input() fullscreenControl: boolean = false;

  /**
   * Options for the Fullscreen control.
   */
  @Input() fullscreenControlOptions: google.maps.FullscreenControlOptions;

  /**
   * The map mapTypeId. Defaults to 'roadmap'.
   */
  @Input() mapTypeId:
    | 'roadmap'
    | 'hybrid'
    | 'satellite'
    | 'terrain'
    | string
    | google.maps.MapTypeId = 'roadmap';

  /**
   * Add layers https://developers.google.com/maps/documentation/javascript/trafficlayer to map
   */
  @Input() layers: Array<LayerTypes> | LayerTypes;

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
  @Input() clickableIcons: boolean = true;

  /**
   * This setting controls how gestures on the map are handled.
   * Allowed values:
   * - 'cooperative' (Two-finger touch gestures pan and zoom the map. One-finger touch gestures are not handled by the map.)
   * - 'greedy'      (All touch gestures pan or zoom the map.)
   * - 'none'        (The map cannot be panned or zoomed by user gestures.)
   * - 'auto'        [default] (Gesture handling is either cooperative or greedy, depending on whether the page is scrollable or not.
   */
  @Input() gestureHandling: 'cooperative' | 'greedy' | 'none' | 'auto' = 'auto';

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
  @Input() tilt: number = 0;

  private _observableSubscriptions: Array<Subscription> = [];
  private _fitBoundsSubscription: Subscription;

  /**
   * This event emitter gets emitted when the user clicks on the map (but not when they click on a
   * marker or infoWindow).
   */
  @Output() mapClick: EventEmitter<google.maps.MouseEvent> = new EventEmitter<
    google.maps.MouseEvent
  >();

  /**
   * This event emitter gets emitted when the user right-clicks on the map (but not when they click
   * on a marker or infoWindow).
   */
  @Output() mapRightClick: EventEmitter<
    google.maps.MouseEvent
  > = new EventEmitter<google.maps.MouseEvent>();

  /**
   * This event emitter gets emitted when the user double-clicks on the map (but not when they click
   * on a marker or infoWindow).
   */
  @Output() mapDblClick: EventEmitter<
    google.maps.MouseEvent
  > = new EventEmitter<google.maps.MouseEvent>();

  /**
   * This event emitter is fired when the map center changes.
   */
  @Output() centerChange: EventEmitter<
    google.maps.LatLngLiteral
  > = new EventEmitter<google.maps.LatLngLiteral>();

  /**
   * This event is fired when the viewport bounds have changed.
   */
  @Output() boundsChange: EventEmitter<
    google.maps.LatLngBounds
  > = new EventEmitter<google.maps.LatLngBounds>();

  /**
   * This event is fired when the mapTypeId property changes.
   */
  @Output() mapTypeIdChange: EventEmitter<
    google.maps.MapTypeId
  > = new EventEmitter<google.maps.MapTypeId>();

  /**
   * This event is fired when the map becomes idle after panning or zooming.
   */
  @Output() idle: EventEmitter<void> = new EventEmitter<void>();

  /**
   * This event is fired when the zoom level has changed.
   */
  @Output() zoomChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * This event is fired when the google map is fully initialized.
   * You get the google.maps.Map instance as a result of this EventEmitter.
   */
  @Output() mapReady: EventEmitter<google.maps.Map> = new EventEmitter<
    google.maps.Map
  >();

  /**
   * This event is fired when the visible tiles have finished loading.
   */
  @Output() tilesLoaded: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('container', { static: true }) container: ElementRef;

  /** @internal */
  ngOnInit() {
    this._initMapInstance(this.container.nativeElement);
  }

  private async _initMapInstance(el: HTMLElement) {
    await this._mapsWrapper.createMap(el, {
      center: { lat: this.latitude || 0, lng: this.longitude || 0 },
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
    });
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

  /** @internal */
  ngOnDestroy() {
    // unsubscribe all registered observable subscriptions
    this._observableSubscriptions.forEach((s) => s.unsubscribe());

    // remove all listeners from the map instance
    this._mapsWrapper.clearInstanceListeners();
    if (this._fitBoundsSubscription) {
      this._fitBoundsSubscription.unsubscribe();
    }
  }

  /* @internal */
  ngOnChanges(changes: SimpleChanges) {
    this._updateMapOptionsChanges(changes);
    this._updatePosition(changes);
    this._layerChanges(changes);
  }

  private _updateMapOptionsChanges(changes: SimpleChanges) {
    const options: SimpleChanges = {};
    const optionKeys = Object.keys(changes).filter((k) =>
      NgMapsViewComponent._mapOptionsAttributes.includes(k),
    );
    optionKeys.forEach((k) => {
      options[k] = changes[k].currentValue;
    });
    return this._mapsWrapper.setMapOptions(options);
  }

  private async _layerChanges(changes: SimpleChanges) {
    if (changes.layers) {
      const map = await this._mapsWrapper.getNativeMap();
      const layers = Array.isArray(this.layers) ? this.layers : [this.layers];
      layers.forEach((layer) => {
        if (!this._layerInstance.has(layer)) {
          const i:
            | google.maps.TrafficLayer
            | google.maps.TransitLayer
            | google.maps.BicyclingLayer = new google.maps[layer]();
          i.setMap(map);
          this._layerInstance.set(layer, i);
        }
      });
      Array.from(this._layerInstance.keys()).forEach((layer) => {
        if (!layers.includes(layer)) {
          const i = this._layerInstance.get(layer);
          i.setMap(null);
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
  triggerResize(recenter: boolean = true): Promise<void> {
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

  private async _updatePosition(changes: SimpleChanges) {
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
    const center = await this._mapsWrapper.getCenter();
    if (
      !(
        typeof this.latitude !== 'number' || typeof this.longitude !== 'number'
      ) &&
      this.latitude !== center.lat() &&
      this.longitude !== center.lng()
    ) {
      await this._setCenter();
      return;
    }
  }

  private _setCenter() {
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

  private _fitBounds() {
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
        return this._updateBounds(this.fitBounds);
    }
  }

  private _subscribeToFitBoundsUpdates() {
    this._zone.runOutsideAngular(() => {
      this._fitBoundsSubscription = this._fitBoundsService
        .getBounds$()
        .subscribe((b) => {
          return this._zone.run(() => this._updateBounds(b));
        });
    });
  }

  protected async _updateBounds(
    bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
  ) {
    if (bounds != null) {
      /**
       * await map to not update bounds till map is initialized
       */
      await this._mapsWrapper.getNativeMap();
      if (this._isLatLngBoundsLiteral(bounds)) {
        bounds = new google.maps.LatLngBounds().union(bounds);
      }
      if (this.usePanning) {
        return this._mapsWrapper.panToBounds(bounds, this.boundsPadding);
      } else {
        return this._mapsWrapper.fitBounds(bounds, this.boundsPadding);
      }
    }
  }

  protected _isLatLngBoundsLiteral(
    bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
  ): bounds is google.maps.LatLngBoundsLiteral {
    return bounds != null && (bounds as any).extend === undefined;
  }

  private _handleMapCenterChange() {
    const s = this._mapsWrapper
      .subscribeToMapEvent<void>('center_changed')
      .subscribe(() => {
        this._mapsWrapper.getCenter().then((center: google.maps.LatLng) => {
          this.latitude = center.lat();
          this.longitude = center.lng();
          this.centerChange.emit({
            lat: this.latitude,
            lng: this.longitude,
          } as google.maps.LatLngLiteral);
        });
      });
    this._observableSubscriptions.push(s);
  }

  private _handleBoundsChange() {
    const s = this._mapsWrapper
      .subscribeToMapEvent<void>('bounds_changed')
      .subscribe(() => {
        this._mapsWrapper
          .getBounds()
          .then((bounds: google.maps.LatLngBounds) => {
            this.boundsChange.emit(bounds);
          });
      });
    this._observableSubscriptions.push(s);
  }

  private _handleMapTypeIdChange() {
    const s = this._mapsWrapper
      .subscribeToMapEvent<void>('maptypeid_changed')
      .subscribe(() => {
        this._mapsWrapper
          .getMapTypeId()
          .then((mapTypeId: google.maps.MapTypeId) => {
            this.mapTypeIdChange.emit(mapTypeId);
          });
      });
    this._observableSubscriptions.push(s);
  }

  private _handleMapZoomChange() {
    const s = this._mapsWrapper
      .subscribeToMapEvent<void>('zoom_changed')
      .subscribe(() => {
        this._mapsWrapper.getZoom().then((z: number) => {
          this.zoom = z;
          this.zoomChange.emit(z);
        });
      });
    this._observableSubscriptions.push(s);
  }

  private _handleIdleEvent() {
    const s = this._mapsWrapper
      .subscribeToMapEvent<void>('idle')
      .subscribe(() => {
        this.idle.emit(void 0);
      });
    this._observableSubscriptions.push(s);
  }

  private _handleTilesLoadedEvent() {
    const s = this._mapsWrapper
      .subscribeToMapEvent<void>('tilesloaded')
      .subscribe(() => this.tilesLoaded.emit(void 0));
    this._observableSubscriptions.push(s);
  }

  private _handleMapMouseEvents() {
    interface Emitter {
      emit(value: any): void;
    }

    interface Event {
      name: string;
      emitter: Emitter;
    }

    const events: Array<Event> = [
      { name: 'click', emitter: this.mapClick },
      { name: 'rightclick', emitter: this.mapRightClick },
      { name: 'dblclick', emitter: this.mapDblClick },
    ];

    events.forEach((e: Event) => {
      const s = this._mapsWrapper
        .subscribeToMapEvent<{ latLng: google.maps.LatLng }>(e.name)
        .subscribe((event: { latLng: google.maps.LatLng }) => {
          // @ts-ignore
          const value = {
            coords: { lat: event.latLng.lat(), lng: event.latLng.lng() },
          } as MouseEvent;
          e.emitter.emit(value);
        });
      this._observableSubscriptions.push(s);
    });
  }
}
