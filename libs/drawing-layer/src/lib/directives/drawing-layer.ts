import {
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChange,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DrawingManager } from '../services/drawing-manager';

let drawingManagerId = 0;

/**
 * NgMapsDrawingLayer renders a map drawing manager inside a {@link NgMapsViewComponent}.
 *
 * ### Example
 * ```typescript
 * import { Component } from '@angular/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  styles: [`
 *    map-view {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <map-view [latitude]="lat" [longitude]="lng" [zoom]="zoom">
 *      <map-drawing-layer
 *        [drawingControl]="true"
 *        [drawingControlOptions]="{
 *          position: 10,
 *          drawingModes: ['circle', 'polyline']
 *        }"
 *        [drawingMode]="drawingMode">
 *      </map-drawing-layer>
 *    </map-view>
 *  `
 * })
 * ```
 */
@Directive({
  selector: 'map-drawing-layer',
  inputs: [
    'drawingMode',
    'drawingControl',
    'drawingControlOptions',
    'circleOptions',
    'markerOptions',
    'polylineOptions',
    'polygonOptions',
    'rectangleOptions',
  ],
  outputs: [
    'overlayComplete',
    'circleComplete',
    'markerComplete',
    'polylineComplete',
    'polygonComplete',
    'rectangleComplete',
  ],
})
export class NgMapsDrawingLayer implements OnDestroy, OnChanges {
  /**
   * The drawing mode of the drawing manager.
   */
  @Input() drawingMode: google.maps.drawing.OverlayType;

  /**
   * Wether drawing controls are shown on the map.
   */
  @Input() drawingControl: boolean;

  /**
   * Configuration for the drawing controls of the drawing manager.
   */
  @Input() drawingControlOptions: google.maps.drawing.DrawingControlOptions;

  /**
   * Circle options for the drawing manager.
   */
  @Input() circleOptions: google.maps.CircleOptions;

  /**
   * Marker options for the drawing manager.
   */
  @Input() markerOptions: google.maps.MarkerOptions;

  /**
   * Polyline options for the drawing manager.
   */
  @Input() polylineOptions: google.maps.PolylineOptions;

  /**
   * Polygon options for the drawing manager.
   */
  @Input() polygonOptions: google.maps.PolygonOptions;

  /**
   * Rectangle options for the drawing manager.
   */
  @Input() rectangleOptions: google.maps.RectangleOptions;

  /**
   * This event emitter gets emitted when the user finishes drawing any overlay.
   */
  @Output()
  overlayComplete: EventEmitter<google.maps.drawing.OverlayCompleteEvent> = new EventEmitter<google.maps.drawing.OverlayCompleteEvent>();

  /**
   * This event emitter gets emitted when the user finishes drawing a circle.
   */
  @Output()
  circleComplete: EventEmitter<google.maps.Circle> = new EventEmitter<google.maps.Circle>();

  /**
   * This event emitter gets emitted when the user finishes drawing a marker.
   */
  @Output()
  markerComplete: EventEmitter<google.maps.Marker> = new EventEmitter<google.maps.Marker>();

  /**
   * This event emitter gets emitted when the user finishes drawing a polyline.
   */
  @Output()
  polylineComplete: EventEmitter<google.maps.Polyline> = new EventEmitter<google.maps.Polyline>();

  /**
   * This event emitter gets emitted when the user finishes drawing a polygon.
   */
  @Output()
  polygonComplete: EventEmitter<google.maps.Polygon> = new EventEmitter<google.maps.Polygon>();

  /**
   * This event emitter gets emitted when the user finishes drawing a rectangle.
   */
  @Output()
  rectangleComplete: EventEmitter<google.maps.Rectangle> = new EventEmitter<google.maps.Rectangle>();

  private _drawingManagerAddedToManager: boolean = false;
  private _id: string;
  private _observableSubscriptions: Subscription[] = [];

  constructor(private _drawingManagerManager: DrawingManager) {
    this._id = (drawingManagerId++).toString();
  }

  /** @internal */
  ngOnChanges(changes: { [key: string]: SimpleChange }) {
    if (!this._drawingManagerAddedToManager) {
      this._drawingManagerManager.addDrawingManager(this);
      this._drawingManagerAddedToManager = true;
      this._addEventListeners();
      return;
    }

    if (changes.drawingMode) {
      this._drawingManagerManager.updateDrawingMode(this);
    }
    if (changes.drawingControl) {
      this._drawingManagerManager.updateDrawingControl(this);
    }
    if (changes.drawingControlOptions) {
      this._drawingManagerManager.updateDrawingControlOptions(this);
    }
    if (changes.circleOptions) {
      this._drawingManagerManager.updateCircleOptions(this);
    }
    if (changes.markerOptions) {
      this._drawingManagerManager.updateMarkerOptions(this);
    }
    if (changes.polylineOptions) {
      this._drawingManagerManager.updatePolylineOptions(this);
    }
    if (changes.polygonOptions) {
      this._drawingManagerManager.updatePolygonOptions(this);
    }
    if (changes.rectangleOptions) {
      this._drawingManagerManager.updateRectangleOptions(this);
    }
  }

  private _addEventListeners() {
    const overlayComplete = this._drawingManagerManager
      .createEventObservable<any>('overlaycomplete', this)
      .subscribe((e: google.maps.drawing.OverlayCompleteEvent) => {
        this.overlayComplete.emit(e);
      });
    this._observableSubscriptions.push(overlayComplete);

    const circleComplete = this._drawingManagerManager
      .createEventObservable<google.maps.Circle>('circlecomplete', this)
      .subscribe((e: google.maps.Circle) => {
        this.circleComplete.emit(e as google.maps.Circle);
      });
    this._observableSubscriptions.push(circleComplete);

    const markerComplete = this._drawingManagerManager
      .createEventObservable<google.maps.Marker>('markercomplete', this)
      .subscribe((e: google.maps.Marker) => {
        this.markerComplete.emit(e as google.maps.Marker);
      });
    this._observableSubscriptions.push(markerComplete);

    const polylineComplete = this._drawingManagerManager
      .createEventObservable<google.maps.Polyline>('polylinecomplete', this)
      .subscribe((e: google.maps.Polyline) => {
        this.polylineComplete.emit(e as google.maps.Polyline);
      });
    this._observableSubscriptions.push(polylineComplete);

    const polygonComplete = this._drawingManagerManager
      .createEventObservable<google.maps.Polygon>('polygoncomplete', this)
      .subscribe((e: google.maps.Polygon) => {
        this.polygonComplete.emit(e as google.maps.Polygon);
      });
    this._observableSubscriptions.push(polygonComplete);

    const rectangleComplete = this._drawingManagerManager
      .createEventObservable<google.maps.Rectangle>('rectanglecomplete', this)
      .subscribe((e: google.maps.Rectangle) => {
        this.rectangleComplete.emit(e as google.maps.Rectangle);
      });
    this._observableSubscriptions.push(rectangleComplete);
  }

  /** @internal */
  id(): string {
    return this._id;
  }

  /** @internal */
  toString(): string {
    return 'AgmDrawingManager-' + this._id.toString();
  }

  /** @internal */
  ngOnDestroy() {
    this._drawingManagerManager.deleteDrawingManager(this);
    // unsubscribe all registered observable subscriptions
    this._observableSubscriptions.forEach((s) => s.unsubscribe());
  }
}
