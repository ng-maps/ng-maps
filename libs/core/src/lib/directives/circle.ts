import {
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { BoundsLiteral } from '../interface/bounds';
import { CircleOptions } from '../interface/circle-options';
import { GeoPoint } from '../interface/geo-point';
import { CircleManager } from '../services/managers/circle-manager';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'map-circle',
})
export class NgMapsCircleDirective
  implements OnInit, OnChanges, OnDestroy, CircleOptions
{
  constructor(private _manager: CircleManager) {}

  private static _mapOptions: Array<string> = [
    'fillColor',
    'fillOpacity',
    'strokeColor',
    'strokeOpacity',
    'strokePosition',
    'strokeWeight',
    'visible',
    'zIndex',
    'clickable',
  ];
  /**
   * The latitude position of the circle (required).
   */
  @Input() public latitude?: number;

  /**
   * The clickable position of the circle (required).
   */
  @Input() public longitude?: number;

  /**
   * Indicates whether this Circle handles mouse events. Defaults to true.
   */
  @Input() public clickable: boolean = true;

  /**
   * If set to true, the user can drag this circle over the map. Defaults to false.
   */
  @Input() public draggable: boolean = false;

  /**
   * If set to true, the user can edit this circle by dragging the control points shown at
   * the center and around the circumference of the circle. Defaults to false.
   */
  @Input() public editable: boolean = false;

  /**
   * The fill color. All CSS3 colors are supported except for extended named colors.
   */
  @Input() public fillColor?: string;

  /**
   * The fill opacity between 0.0 and 1.0.
   */
  @Input() public fillOpacity?: number;

  /**
   * The radius in meters on the Earth's surface.
   */
  @Input() public radius: number = 0;

  /**
   * The stroke color. All CSS3 colors are supported except for extended named colors.
   */
  @Input() public strokeColor?: string;

  /**
   * The stroke opacity between 0.0 and 1.0
   */
  @Input() public strokeOpacity?: number;

  /**
   * The stroke position. Defaults to CENTER.
   * This property is not supported on Internet Explorer 8 and earlier.
   *
   * @fixme
   */
  // @Input() strokePosition: google.maps.StrokePosition =
  //   google.maps.StrokePosition.CENTER;

  /**
   * The stroke width in pixels.
   */
  @Input() public strokeWeight: number = 0;

  /**
   * Whether this circle is visible on the map. Defaults to true.
   */
  @Input() public visible: boolean = true;

  /**
   * The zIndex compared to other polys.
   */
  @Input() public zIndex?: number;

  /**
   * This event is fired when the circle's center is changed.
   */
  @Output()
  public centerChange: EventEmitter<GeoPoint> = new EventEmitter<GeoPoint>();

  /**
   * This event emitter gets emitted when the user clicks on the circle.
   */
  @Output()
  public circleClick: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event emitter gets emitted when the user clicks on the circle.
   */
  @Output()
  public circleDblClick: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event is repeatedly fired while the user drags the circle.
   */
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public drag: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event is fired when the user stops dragging the circle.
   */
  @Output()
  public dragEnd: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event is fired when the user starts dragging the circle.
   */
  @Output()
  public dragStart: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event is fired when the DOM mousedown event is fired on the circle.
   */
  @Output()
  public mouseDown: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event is fired when the DOM mousemove event is fired on the circle.
   */
  @Output()
  public mouseMove: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event is fired on circle mouseout.
   */
  @Output()
  public mouseOut: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event is fired on circle mouseover.
   */
  @Output()
  public mouseOver: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event is fired when the DOM mouseup event is fired on the circle.
   */
  @Output()
  public mouseUp: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event is fired when the circle's radius is changed.
   */
  @Output()
  public radiusChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * This event is fired when the circle is right-clicked on.
   */
  @Output()
  public rightClick: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  private _circleAddedToManager: boolean = false;

  private subscription: Subscription = new Subscription();

  /** @internal */
  public ngOnInit() {
    this._manager.addCircle(this);
    this._circleAddedToManager = true;
    this._registerEventListeners();
  }

  /** @internal */
  public ngOnChanges(changes: { [key: string]: SimpleChange }) {
    if (!this._circleAddedToManager) {
      return;
    }
    if (changes.latitude || changes.longitude) {
      this._manager.setCenter(this);
    }
    if (changes.editable) {
      this._manager.setEditable(this);
    }
    if (changes.draggable) {
      this._manager.setDraggable(this);
    }
    if (changes.visible) {
      this._manager.setVisible(this);
    }
    if (changes.radius) {
      this._manager.setRadius(this);
    }
    this._updateCircleOptionsChanges(changes);
  }

  private _updateCircleOptionsChanges(changes: {
    [propName: string]: SimpleChange;
  }) {
    const options: { [propName: string]: any } = {};
    const optionKeys = Object.keys(changes).filter(
      (k) => NgMapsCircleDirective._mapOptions.indexOf(k) !== -1,
    );
    optionKeys.forEach((k) => {
      options[k] = changes[k].currentValue;
    });
    if (optionKeys.length > 0) {
      this._manager.setOptions(this, options);
    }
  }

  private _registerEventListeners() {
    const events: Map<string, EventEmitter<any>> = new Map<
      string,
      EventEmitter<any>
    >();
    events.set('center_changed', this.centerChange);
    events.set('click', this.circleClick);
    events.set('dblclick', this.circleDblClick);
    events.set('drag', this.drag);
    events.set('dragend', this.dragEnd);
    events.set('dragstart', this.dragStart);
    events.set('mousedown', this.mouseDown);
    events.set('mousemove', this.mouseMove);
    events.set('mouseout', this.mouseOut);
    events.set('mouseover', this.mouseOver);
    events.set('mouseup', this.mouseUp);
    events.set('radius_changed', this.radiusChange);
    events.set('rightclick', this.rightClick);

    events.forEach((eventEmitter, eventName) => {
      this.subscription.add(
        this._manager
          .createEventObservable<google.maps.MapMouseEvent>(eventName, this)
          .subscribe((value) => {
            switch (eventName) {
              case 'radius_changed':
                this._manager
                  .getRadius(this)
                  .then((radius) => eventEmitter.emit(radius));
                break;
              case 'center_changed':
                this._manager.getCenter(this).then((center) =>
                  eventEmitter.emit({
                    ...center,
                  }),
                );
                break;
              default:
                eventEmitter.emit(value);
            }
          }),
      );
    });
  }

  /** @internal */
  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this._manager.removeCircle(this);
  }

  /**
   * Gets the LatLngBounds of this Circle.
   */
  public async getBounds(): Promise<BoundsLiteral | null> {
    return this._manager.getBounds(this);
  }

  public async getCenter(): Promise<GeoPoint | null> {
    return this._manager.getCenter(this);
  }
}
