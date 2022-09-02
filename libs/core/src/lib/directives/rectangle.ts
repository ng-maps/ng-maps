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
import { RectangleOptions } from '../interface/rectangle-options';
import { RectangleManager } from '../services/managers/rectangle-manager';

@Directive({
  selector: 'map-rectangle',
})
export class NgMapsRectangleDirective
  implements OnInit, OnChanges, OnDestroy, RectangleOptions {
  constructor(private _manager: RectangleManager) {}

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
   * The north position of the rectangle (required).
   */
  @Input() public north: number;

  /**
   * The east position of the rectangle (required).
   */
  @Input() public east: number;

  /**
   * The south position of the rectangle (required).
   */
  @Input() public south: number;

  /**
   * The west position of the rectangle (required).
   */
  @Input() public west: number;

  /**
   * Indicates whether this Rectangle handles mouse events. Defaults to true.
   */
  @Input() public clickable: boolean = true;

  /**
   * If set to true, the user can drag this rectangle over the map. Defaults to false.
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('rectangleDraggable') public draggable: boolean = false;

  /**
   * If set to true, the user can edit this rectangle by dragging the control points shown at
   * the center and around the circumference of the rectangle. Defaults to false.
   */
  @Input() public editable: boolean = false;

  /**
   * The fill color. All CSS3 colors are supported except for extended named colors.
   */
  @Input() public fillColor: string;

  /**
   * The fill opacity between 0.0 and 1.0.
   */
  @Input() public fillOpacity: number;

  /**
   * The stroke color. All CSS3 colors are supported except for extended named colors.
   */
  @Input() public strokeColor: string;

  /**
   * The stroke opacity between 0.0 and 1.0
   */
  @Input() public strokeOpacity: number;

  /**
   * The stroke position. Defaults to CENTER.
   * This property is not supported on Internet Explorer 8 and earlier.
   */
  @Input() public strokePosition: 'CENTER' | 'INSIDE' | 'OUTSIDE' = 'CENTER';

  /**
   * The stroke width in pixels.
   */
  @Input() public strokeWeight: number = 0;

  /**
   * Whether this rectangle is visible on the map. Defaults to true.
   */
  @Input() public visible: boolean = true;

  /**
   * The zIndex compared to other polys.
   */
  @Input() public zIndex: number;

  /**
   * This event is fired when the rectangle's is changed.
   */
  @Output()
  public boundsChange: EventEmitter<google.maps.LatLngBoundsLiteral> = new EventEmitter<google.maps.LatLngBoundsLiteral>();

  /**
   * This event emitter gets emitted when the user clicks on the rectangle.
   */
  @Output()
  public rectangleClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event emitter gets emitted when the user clicks on the rectangle.
   */
  @Output()
  public rectangleDblClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event is repeatedly fired while the user drags the rectangle.
   */
  @Output()
  public drag: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event is fired when the user stops dragging the rectangle.
   */
  @Output()
  public dragEnd: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event is fired when the user starts dragging the rectangle.
   */
  @Output()
  public dragStart: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event is fired when the DOM mousedown event is fired on the rectangle.
   */
  @Output()
  public mouseDown: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event is fired when the DOM mousemove event is fired on the rectangle.
   */
  @Output()
  public mouseMove: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event is fired on rectangle mouseout.
   */
  @Output()
  public mouseOut: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event is fired on rectangle mouseover.
   */
  @Output()
  public mouseOver: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event is fired when the DOM mouseup event is fired on the rectangle.
   */
  @Output()
  public mouseUp: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event is fired when the rectangle is right-clicked on.
   */
  @Output()
  public rightClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  private _rectangleAddedToManager: boolean = false;

  private subscription: Subscription = new Subscription();

  /** @internal */
  public ngOnInit() {
    this._manager.addRectangle(this);
    this._rectangleAddedToManager = true;
    this._registerEventListeners();
  }

  /** @internal */
  public ngOnChanges(changes: { [key: string]: SimpleChange }) {
    if (!this._rectangleAddedToManager) {
      return;
    }
    if (changes.north || changes.east || changes.south || changes.west) {
      this._manager.setBounds(this);
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
    this._updateRectangleOptionsChanges(changes);
  }

  private _updateRectangleOptionsChanges(changes: {
    [propName: string]: SimpleChange;
  }) {
    const options: { [propName: string]: any } = {};
    const optionKeys = Object.keys(changes).filter(
      (k) => NgMapsRectangleDirective._mapOptions.indexOf(k) !== -1,
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
    events.set('bounds_changed', this.boundsChange);
    events.set('click', this.rectangleClick);
    events.set('dblclick', this.rectangleDblClick);
    events.set('drag', this.drag);
    events.set('dragend', this.dragEnd);
    events.set('dragStart', this.dragStart);
    events.set('mousedown', this.mouseDown);
    events.set('mousemove', this.mouseMove);
    events.set('mouseout', this.mouseOut);
    events.set('mouseover', this.mouseOver);
    events.set('mouseup', this.mouseUp);
    events.set('rightclick', this.rightClick);

    events.forEach((eventEmitter, eventName) => {
      this.subscription.add(
        this._manager
          .createEventObservable<google.maps.MouseEvent>(eventName, this)
          .subscribe((value) => {
            switch (eventName) {
              case 'bounds_changed':
                this._manager
                  .getBounds(this)
                  .then((bounds) => eventEmitter.emit(bounds));
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
    this._manager.removeRectangle(this);
  }

  /**
   * Gets the LatLngBounds of this Rectangle.
   */
  public getBounds(): Promise<BoundsLiteral> {
    return this._manager.getBounds(this);
  }
}
