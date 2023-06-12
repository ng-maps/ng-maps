import {
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

/**
 * NgMapsPolylinePoint represents one element of a polyline within a  {@link
 * NgMapsPolyline}
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'map-polyline-point',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class NgMapsPolylinePoint implements OnChanges {
  /**
   * The latitude position of the point.
   */
  @Input() public latitude?: number;

  /**
   * The longitude position of the point;
   */
  @Input() public longitude?: number;

  /**
   * This event emitter gets emitted when the position of the point changed.
   */
  @Output()
  public positionChanged: EventEmitter<google.maps.LatLngLiteral> =
    new EventEmitter<google.maps.LatLngLiteral>();

  public ngOnChanges(changes: SimpleChanges): any {
    if (changes.latitude || changes.longitude) {
      const position: google.maps.LatLngLiteral = {
        lat: changes.latitude ? changes.latitude.currentValue : this.latitude,
        lng: changes.longitude
          ? changes.longitude.currentValue
          : this.longitude,
      } as google.maps.LatLngLiteral;
      this.positionChanged.emit(position);
    }
  }
}
