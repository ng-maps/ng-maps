import {
  AfterContentInit,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { MVCEvent } from '../interface/mvc-event';
import { PolylineManager } from '../services/managers/polyline-manager';

import { NgMapsPolylinePoint } from './polyline-point';

let polylineId = 0;

/**
 * NgMapsPolyline renders a polyline on a {@link https://ng-maps.github.io/core/components/NgMapsViewComponent.html|NgMapsView}
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'map-polyline',
  standalone: false,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class NgMapsPolyline implements OnDestroy, OnChanges, AfterContentInit {
  constructor(private _polylineManager: PolylineManager) {
    this._id = (polylineId++).toString();
  }

  private static _polylineOptionsAttributes: Array<string> = [
    'draggable',
    'editable',
    'visible',
    'geodesic',
    'strokeColor',
    'strokeOpacity',
    'strokeWeight',
    'zIndex',
    'icons',
  ];
  /**
   * Indicates whether this Polyline handles mouse events. Defaults to true.
   */
  @Input() public clickable: boolean = true;

  /**
   * If set to true, the user can drag this shape over the map. The geodesic property defines the
   * mode of dragging. Defaults to false.
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('polylineDraggable') public draggable: boolean = false;

  /**
   * If set to true, the user can edit this shape by dragging the control points shown at the
   * vertices and on each segment. Defaults to false.
   */
  @Input() public editable: boolean = false;

  /**
   * When true, edges of the polygon are interpreted as geodesic and will follow the curvature of
   * the Earth. When false, edges of the polygon are rendered as straight lines in screen space.
   * Note that the shape of a geodesic polygon may appear to change when dragged, as the dimensions
   * are maintained relative to the surface of the earth. Defaults to false.
   */
  @Input() public geodesic: boolean = false;

  /**
   * The stroke color. All CSS3 colors are supported except for extended named colors.
   */
  @Input() public strokeColor?: string;

  /**
   * The stroke opacity between 0.0 and 1.0.
   */
  @Input() public strokeOpacity?: number;

  /**
   * The stroke width in pixels.
   */
  @Input() public strokeWeight?: number;

  /**
   * The icons to be rendered along the polyline.
   */
  @Input() public icons?: Array<google.maps.IconSequence>;

  /**
   * Whether this polyline is visible on the map. Defaults to true.
   */
  @Input() public visible: boolean = true;

  /**
   * The zIndex compared to other polys.
   */
  @Input() public zIndex?: number;

  /**
   * This event is fired when the DOM click event is fired on the Polyline.
   */
  @Output()
  public lineClick: EventEmitter<google.maps.PolyMouseEvent> =
    new EventEmitter<google.maps.PolyMouseEvent>();

  /**
   * This event is fired when the DOM dblclick event is fired on the Polyline.
   */
  @Output()
  public lineDblClick: EventEmitter<google.maps.PolyMouseEvent> =
    new EventEmitter<google.maps.PolyMouseEvent>();

  /**
   * This event is repeatedly fired while the user drags the polyline.
   */
  @Output()
  public lineDrag: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event is fired when the user stops dragging the polyline.
   */
  @Output()
  public lineDragEnd: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event is fired when the user starts dragging the polyline.
   */
  @Output()
  public lineDragStart: EventEmitter<MouseEvent> =
    new EventEmitter<MouseEvent>();

  /**
   * This event is fired when the DOM mousedown event is fired on the Polyline.
   */
  @Output()
  public lineMouseDown: EventEmitter<google.maps.PolyMouseEvent> =
    new EventEmitter<google.maps.PolyMouseEvent>();

  /**
   * This event is fired when the DOM mousemove event is fired on the Polyline.
   */
  @Output()
  public lineMouseMove: EventEmitter<google.maps.PolyMouseEvent> =
    new EventEmitter<google.maps.PolyMouseEvent>();

  /**
   * This event is fired on Polyline mouseout.
   */
  @Output()
  public lineMouseOut: EventEmitter<google.maps.PolyMouseEvent> =
    new EventEmitter<google.maps.PolyMouseEvent>();

  /**
   * This event is fired on Polyline mouseover.
   */
  @Output()
  public lineMouseOver: EventEmitter<google.maps.PolyMouseEvent> =
    new EventEmitter<google.maps.PolyMouseEvent>();

  /**
   * This event is fired whe the DOM mouseup event is fired on the Polyline
   */
  @Output()
  public lineMouseUp: EventEmitter<google.maps.PolyMouseEvent> =
    new EventEmitter<google.maps.PolyMouseEvent>();

  /**
   * This even is fired when the Polyline is right-clicked on.
   */
  @Output()
  public lineRightClick: EventEmitter<google.maps.PolyMouseEvent> =
    new EventEmitter<google.maps.PolyMouseEvent>();

  /**
   * This event is fired after Polyline's path changes.
   */
  @Output() polyPathChange = new EventEmitter<MVCEvent<google.maps.LatLng>>();

  /**
   * @internal
   */
  @ContentChildren(NgMapsPolylinePoint)
  public points?: QueryList<NgMapsPolylinePoint>;

  private _id: string;
  private _polylineAddedToManager: boolean = false;
  private subscription: Subscription = new Subscription();

  /** @internal */
  public ngAfterContentInit() {
    if (this.points) {
      this.points.forEach((point: NgMapsPolylinePoint) => {
        const subscription = point.positionChanged.subscribe(() => {
          this._polylineManager.updatePolylinePoints(this);
        });
        this.subscription.add(subscription);
      });

      const s = this.points.changes.subscribe(() =>
        this._polylineManager.updatePolylinePoints(this),
      );
      this.subscription.add(s);
    }
    if (!this._polylineAddedToManager) {
      this._init();
    }
    this._polylineManager.updatePolylinePoints(this);
  }

  public ngOnChanges(changes: SimpleChanges): any {
    if (!this._polylineAddedToManager) {
      this._init();
      return;
    }

    const options: { [propName: string]: any } = {};
    const optionKeys = Object.keys(changes).filter(
      (k) => NgMapsPolyline._polylineOptionsAttributes.indexOf(k) !== -1,
    );
    optionKeys.forEach((k) => (options[k] = changes[k].currentValue));
    this._polylineManager.setPolylineOptions(this, options);
  }

  private _init() {
    this._polylineManager.addPolyline(this);
    this._polylineAddedToManager = true;
    this._addEventListeners();
  }

  private _addEventListeners() {
    const handlers = [
      {
        name: 'click',
        handler: (ev: google.maps.PolyMouseEvent) => this.lineClick.emit(ev),
      },
      {
        name: 'dblclick',
        handler: (ev: google.maps.PolyMouseEvent) => this.lineDblClick.emit(ev),
      },
      { name: 'drag', handler: (ev: MouseEvent) => this.lineDrag.emit(ev) },
      {
        name: 'dragend',
        handler: (ev: MouseEvent) => this.lineDragEnd.emit(ev),
      },
      {
        name: 'dragstart',
        handler: (ev: MouseEvent) => this.lineDragStart.emit(ev),
      },
      {
        name: 'mousedown',
        handler: (ev: google.maps.PolyMouseEvent) =>
          this.lineMouseDown.emit(ev),
      },
      {
        name: 'mousemove',
        handler: (ev: google.maps.PolyMouseEvent) =>
          this.lineMouseMove.emit(ev),
      },
      {
        name: 'mouseout',
        handler: (ev: google.maps.PolyMouseEvent) => this.lineMouseOut.emit(ev),
      },
      {
        name: 'mouseover',
        handler: (ev: google.maps.PolyMouseEvent) =>
          this.lineMouseOver.emit(ev),
      },
      {
        name: 'mouseup',
        handler: (ev: google.maps.PolyMouseEvent) => this.lineMouseUp.emit(ev),
      },
      {
        name: 'rightclick',
        handler: (ev: google.maps.PolyMouseEvent) =>
          this.lineRightClick.emit(ev),
      },
    ];
    handlers.forEach((obj) => {
      const os = this._polylineManager
        .createEventObservable(obj.name, this)
        // FIXME
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .subscribe(obj.handler);
      this.subscription.add(os);
    });

    this._polylineManager.createPathEventObservable(this).then((ob$) => {
      const os = ob$.subscribe((pathEvent) =>
        this.polyPathChange.emit(pathEvent),
      );
      this.subscription.add(os);
    });
  }

  /** @internal */
  public _getPoints(): Array<NgMapsPolylinePoint> {
    if (this.points) {
      return this.points.toArray();
    } else {
      return [];
    }
  }

  /** @internal */
  public id(): string {
    return this._id;
  }

  /** @internal */
  public ngOnDestroy() {
    this._polylineManager.deletePolyline(this);
    // unsubscribe all registered observable subscriptions
    this.subscription.unsubscribe();
  }
}
