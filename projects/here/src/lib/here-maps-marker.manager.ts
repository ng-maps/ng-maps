import { Injectable, NgZone } from '@angular/core';
import {
  MapsApiWrapper,
  MarkerManager,
  NgMapsMarkerComponent,
} from '@ng-maps/core';
import { EMPTY, Observable } from 'rxjs';

@Injectable()
export class HereMapsMarkerManager extends MarkerManager<H.map.Marker> {
  constructor(_mapsWrapper: MapsApiWrapper, _zone: NgZone) {
    super(_mapsWrapper, _zone);
  }

  createEventObservable<E>(
    eventName:
      | 'animation_changed'
      | 'clickable_changed'
      | 'cursor_changed'
      | 'draggable_changed'
      | 'flat_changed'
      | 'icon_changed'
      | 'position_changed'
      | 'shape_changed'
      | 'title_changed'
      | 'visible_changed'
      | 'zindex_changed'
      | 'click'
      | 'dblclick'
      | 'drag'
      | 'dragend'
      | 'dragstart'
      | 'mousedown'
      | 'mouseout'
      | 'mouseover'
      | 'mouseup'
      | 'rightclick',
    marker: NgMapsMarkerComponent,
  ): Observable<E> {
    return EMPTY;
  }

  deleteMarker(marker: NgMapsMarkerComponent): void {}

  updateAnimation(marker: NgMapsMarkerComponent): void {}

  updateClickable(marker: NgMapsMarkerComponent): void {}

  updateDraggable(marker: NgMapsMarkerComponent): void {}

  updateIcon(marker: NgMapsMarkerComponent): void {}

  updateLabel(marker: NgMapsMarkerComponent): void {}

  updateMarkerPosition(marker: NgMapsMarkerComponent): void {
    const m: H.map.Marker = this._markers.get(marker);
    const { latitude, longitude } = marker;
    m.setGeometry({ lat: latitude, lng: longitude });
  }

  updateOpacity(marker: NgMapsMarkerComponent): void {}

  updateTitle(marker: NgMapsMarkerComponent): void {}

  updateVisible(marker: NgMapsMarkerComponent): void {
    const m: H.map.Marker = this._markers.get(marker);
    m.setVisibility(marker.visible);
  }

  updateZIndex(marker: NgMapsMarkerComponent): void {
    const m: H.map.Marker = this._markers.get(marker);
    m.setZIndex(marker.zIndex);
  }
}
