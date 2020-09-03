import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChange,
} from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { MarkerIcon } from '../interface/marker-icon';
import { MarkerOptions } from '../interface/marker-options';
import { FitBoundsAccessor, FitBoundsDetails } from '../services/fit-bounds';
import { MarkerManager } from '../services/managers/marker.manager';
import { NgMapsInfoWindowComponent } from './info-window';

let markerId = 0;

/**
 * NgMapsMarkerComponent renders a map marker inside a {@link NgMapsViewComponent}.
 *
 * @example
 * <agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
 *               <agm-marker [latitude]="lat" [longitude]="lng" label="M"></agm-marker>
 * </agm-map>
 */
@Component({
  selector: 'map-marker',
  providers: [
    {
      provide: FitBoundsAccessor,
      useExisting: forwardRef(() => NgMapsMarkerComponent),
    },
  ],
  inputs: [
    'latitude',
    'longitude',
    'title',
    'label',
    'draggable: markerDraggable',
    'iconUrl',
    'icon',
    'openInfoWindow',
    'opacity',
    'optimized',
    'visible',
    'zIndex',
    'animation',
  ],
  outputs: [
    'markerClick',
    'dragStart',
    'drag',
    'dragEnd',
    'mouseOver',
    'mouseOut',
  ],
  template: '<ng-content></ng-content>',
})
export class NgMapsMarkerComponent
  implements
    OnDestroy,
    OnChanges,
    AfterContentInit,
    FitBoundsAccessor,
    MarkerOptions {
  /**
   * The latitude position of the marker.
   */
  @Input() latitude: number;

  /**
   * The longitude position of the marker.
   */
  @Input() longitude: number;

  /**
   * The title of the marker.
   */
  @Input() title: string;

  /**
   * The label (a single uppercase character) for the marker.
   */
  @Input() label: string | google.maps.MarkerLabel;

  /**
   * If true, the marker can be dragged. Default value is false.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('markerDraggable') draggable: boolean = false;

  /**
   * Icon (the URL of the image) for the foreground.
   * Can also be a MarkerIcon (google.maps.Icon in Google Maps Javascript api)
   * @see <a href="https://developers.google.com/maps/documentation/javascript/reference/marker#Icon">google.maps.Icon</a>
   */
  @Input() iconUrl: string | google.maps.Icon;

  @Input() icon: MarkerIcon;

  /**
   * If true, the marker is visible
   */
  @Input() visible: boolean = true;

  /**
   * Whether to automatically open the child info window when the marker is clicked.
   */
  @Input() openInfoWindow: boolean = true;

  /**
   * The marker's opacity between 0.0 and 1.0.
   */
  @Input() opacity: number = 1;

  /**
   * Marker optimize flag. If it is false then it prevent duplicate rendering.
   * Default it is true
   */
  @Input() optimized: boolean = true;

  /**
   * All markers are displayed on the map in order of their zIndex, with higher values displaying in
   * front of markers with lower values. By default, markers are displayed according to their
   * vertical position on screen, with lower markers appearing in front of markers further up the
   * screen.
   */
  @Input() zIndex: number = 1;

  /**
   * If true, the marker can be clicked. Default value is true.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('markerClickable') clickable: boolean = true;

  /**
   * Which animation to play when marker is added to a map.
   * This can be 'BOUNCE' or 'DROP'
   */
  animation: 'BOUNCE' | 'DROP' | null;

  /**
   * This event emitter gets emitted when the user clicks on the marker.
   */
  @Output() markerClick: EventEmitter<NgMapsMarkerComponent> = new EventEmitter<
    NgMapsMarkerComponent
  >();

  /**
   * This event is fired when the user rightclicks on the marker.
   */
  @Output() markerRightClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * This event is fired when the user starts dragging the marker.
   */
  @Output() dragStart: EventEmitter<google.maps.MouseEvent> = new EventEmitter<
    google.maps.MouseEvent
  >();

  /**
   * This event is repeatedly fired while the user drags the marker.
   */
  @Output() drag: EventEmitter<google.maps.MouseEvent> = new EventEmitter<
    google.maps.MouseEvent
  >();

  /**
   * This event is fired when the user stops dragging the marker.
   */
  @Output() dragEnd: EventEmitter<google.maps.MouseEvent> = new EventEmitter<
    google.maps.MouseEvent
  >();

  /**
   * This event is fired when the user mouses over the marker.
   */
  @Output() mouseOver: EventEmitter<google.maps.MouseEvent> = new EventEmitter<
    google.maps.MouseEvent
  >();

  /**
   * This event is fired when the user mouses outside the marker.
   */
  @Output() mouseOut: EventEmitter<google.maps.MouseEvent> = new EventEmitter<
    google.maps.MouseEvent
  >();

  /**
   * @internal
   */
  @ContentChildren(NgMapsInfoWindowComponent) infoWindow: QueryList<
    NgMapsInfoWindowComponent
  > = new QueryList<NgMapsInfoWindowComponent>();

  private _markerAddedToManger: boolean = false;
  private _id: string;
  private subscription: Subscription = new Subscription();

  protected readonly _fitBoundsDetails$: ReplaySubject<
    FitBoundsDetails
  > = new ReplaySubject<FitBoundsDetails>(1);

  constructor(private markerManager: MarkerManager) {
    this._id = (markerId++).toString();
  }

  /**
   *  @internal
   */
  ngAfterContentInit() {
    this.handleInfoWindowUpdate();
    this.infoWindow.changes.subscribe(() => this.handleInfoWindowUpdate());
  }

  private handleInfoWindowUpdate() {
    if (this.infoWindow.length > 1) {
      throw new Error('Expected no more than one info window.');
    }
    this.infoWindow.forEach((marker) => {
      marker.hostMarker = this;
    });
  }

  /**
   * @internal
   */
  ngOnChanges(changes: { [key: string]: SimpleChange }) {
    if (typeof this.latitude === 'string') {
      this.latitude = Number(this.latitude);
    }
    if (typeof this.longitude === 'string') {
      this.longitude = Number(this.longitude);
    }
    if (
      typeof this.latitude !== 'number' ||
      typeof this.longitude !== 'number'
    ) {
      return;
    }
    if (!this._markerAddedToManger) {
      this.markerManager.addMarker(this).then(() => {
        this._updateFitBoundsDetails();
        this._markerAddedToManger = true;
        this._addEventListeners();
      });
      return;
    }
    if (changes.latitude || changes.longitude) {
      this.markerManager.updateMarkerPosition(this);
      this._updateFitBoundsDetails();
    }
    if (changes.title) {
      this.markerManager.updateTitle(this);
    }
    if (changes.label) {
      this.markerManager.updateLabel(this);
    }
    if (changes.draggable) {
      this.markerManager.updateDraggable(this);
    }
    if (changes.iconUrl) {
      this.markerManager.updateIconLegacy(this);
    }
    if (changes.icon) {
      this.markerManager.updateIcon(this);
    }
    if (changes.opacity) {
      this.markerManager.updateOpacity(this);
    }
    if (changes.visible) {
      this.markerManager.updateVisible(this);
    }
    if (changes.zIndex) {
      this.markerManager.updateZIndex(this);
    }
    if (changes.clickable) {
      this.markerManager.updateClickable(this);
    }
    if (changes.animation) {
      this.markerManager.updateAnimation(this);
    }
  }

  /**
   * @internal
   */
  getFitBoundsDetails$(): Observable<FitBoundsDetails> {
    return this._fitBoundsDetails$.asObservable();
  }

  protected _updateFitBoundsDetails() {
    this._fitBoundsDetails$.next({
      latLng: { lat: this.latitude, lng: this.longitude },
    });
  }

  protected _addEventListeners() {
    const cs = this.markerManager
      .createEventObservable(['click', 'pointerdown'], this)
      .subscribe({
        next: (event) => {
          if (this.openInfoWindow) {
            this.infoWindow.forEach((infoWindow) => infoWindow.open(event));
          }
          this.markerClick.emit(this);
        },
      });
    this.subscription.add(cs);

    const rc = this.markerManager
      .createEventObservable('rightclick', this)
      .subscribe(() => {
        this.markerRightClick.emit(null);
      });
    this.subscription.add(rc);

    const ds = this.markerManager
      .createEventObservable<google.maps.MouseEvent>('dragstart', this)
      .subscribe((e: google.maps.MouseEvent) => {
        this.dragStart.emit(e);
      });
    this.subscription.add(ds);

    const d = this.markerManager
      .createEventObservable<google.maps.MouseEvent>('drag', this)
      .subscribe((e: google.maps.MouseEvent) => {
        this.drag.emit(e);
      });
    this.subscription.add(d);

    const dragend = this.markerManager
      .createEventObservable<google.maps.MouseEvent>('dragend', this)
      .subscribe((e: google.maps.MouseEvent) => {
        this.dragEnd.emit(e);
      });
    this.subscription.add(dragend);

    const mouseover = this.markerManager
      .createEventObservable<google.maps.MouseEvent>(
        ['mouseover', 'pointerenter'],
        this,
      )
      .subscribe((e: google.maps.MouseEvent) => {
        this.mouseOver.emit(e);
      });
    this.subscription.add(mouseover);

    const mouseout = this.markerManager
      .createEventObservable<google.maps.MouseEvent>(
        ['mouseout', 'pointerleave'],
        this,
      )
      .subscribe((e: google.maps.MouseEvent) => {
        this.mouseOut.emit(e);
      });
    this.subscription.add(mouseout);
  }

  /** @internal */
  id(): string {
    return this._id;
  }

  /** @internal */
  toString(): string {
    return `NgMapsMarker-${this._id}`;
  }

  /** @internal */
  ngOnDestroy() {
    this.markerManager.deleteMarker(this);
    // unsubscribe all registered observable subscription
    this.subscription.unsubscribe();
  }
}
