import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import { NgMapsMarkerComponent } from '../../directives/marker';
import { MapsApiWrapper } from '../maps-api-wrapper';

@Injectable()
export abstract class MarkerManager<T = any> {
  protected _markers: Map<NgMapsMarkerComponent, T> = new Map<
    NgMapsMarkerComponent,
    T
  >();

  constructor(
    protected _mapsWrapper: MapsApiWrapper,
    protected _zone: NgZone,
  ) {}

  public abstract deleteMarker(marker: NgMapsMarkerComponent): void;

  public abstract updateMarkerPosition(marker: NgMapsMarkerComponent): void;

  public abstract updateTitle(marker: NgMapsMarkerComponent): void;

  public abstract updateLabel(marker: NgMapsMarkerComponent): void;

  public abstract updateDraggable(marker: NgMapsMarkerComponent): void;

  public abstract updateIconLegacy(marker: NgMapsMarkerComponent): void;
  public abstract updateIcon(marker: NgMapsMarkerComponent): void;

  public abstract updateOpacity(marker: NgMapsMarkerComponent): void;

  public abstract updateVisible(marker: NgMapsMarkerComponent): void;

  public abstract updateZIndex(marker: NgMapsMarkerComponent): void;

  public abstract updateClickable(marker: NgMapsMarkerComponent): void;

  public abstract updateAnimation(marker: NgMapsMarkerComponent): void;

  public async addMarker(marker: NgMapsMarkerComponent): Promise<void> {
    if (
      typeof marker.latitude !== 'number' ||
      typeof marker.longitude !== 'number'
    ) {
      return;
    }
    const m = await this._mapsWrapper.createMarker(
      { lat: marker.latitude, lng: marker.longitude },
      {
        label: marker.label,
        draggable: marker.draggable,
        icon: marker.iconUrl,
        opacity: marker.opacity,
        optimized: marker.optimized,
        visible: marker.visible,
        zIndex: marker.zIndex,
        title: marker.title,
        clickable: marker.clickable,
        animation:
          typeof marker.animation === 'string'
            ? google.maps.Animation[marker.animation]
            : marker.animation,
      } as any,
    );
    this._markers.set(marker, m);
  }

  public getNativeMarker(marker: NgMapsMarkerComponent): T | undefined {
    return this._markers.get(marker);
  }

  public abstract createEventObservable<E>(
    eventName: string | Array<string>,
    marker: NgMapsMarkerComponent,
  ): Observable<E>;
}
