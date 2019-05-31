import {Directive, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

/**
 * NgMapsPolylinePoint represents one element of a polyline within a  {@link
 * SembGoogleMapPolyline}
 */
@Directive({
  selector: 'agm-polyline-point, map-polyline-point'
})
export class NgMapsPolylinePoint implements OnChanges {
  /**
   * The latitude position of the point.
   */
  @Input() public latitude: number;

  /**
   * The longitude position of the point;
   */
  @Input() public longitude: number;

  /**
   * This event emitter gets emitted when the position of the point changed.
   */
  @Output() positionChanged: EventEmitter<google.maps.LatLngLiteral> = new EventEmitter<google.maps.LatLngLiteral>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): any {
    if (changes.latitude || changes.longitude) {
      const position: google.maps.LatLngLiteral = {
        lat: changes.latitude.currentValue,
        lng: changes.longitude.currentValue
      } as google.maps.LatLngLiteral;
      this.positionChanged.emit(position);
    }
  }
}
