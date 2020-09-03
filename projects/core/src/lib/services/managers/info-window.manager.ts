import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { NgMapsInfoWindowComponent } from '../../directives/info-window';
import { NgMapsViewComponent } from '../../directives/map';
import { MapsApiWrapper } from '../maps-api-wrapper';
import { MarkerManager } from './marker.manager';

@Injectable()
export abstract class InfoWindowManager<T> {
  protected _infoWindows: Map<NgMapsInfoWindowComponent, T> = new Map();

  constructor(
    protected _mapsWrapper: MapsApiWrapper,
    protected _zone: NgZone,
    protected _markerManager: MarkerManager,
  ) {}

  abstract deleteInfoWindow(
    infoWindow: NgMapsInfoWindowComponent,
  ): Promise<void>;

  abstract setPosition(infoWindow: NgMapsInfoWindowComponent): void;

  abstract setZIndex(infoWindow: NgMapsInfoWindowComponent): void;

  abstract open(
    infoWindow: NgMapsInfoWindowComponent,
    event?: any,
  ): Promise<void>;

  abstract close(infoWindow: NgMapsInfoWindowComponent): void;

  abstract setOptions(
    infoWindow: NgMapsInfoWindowComponent,
    options: google.maps.InfoWindowOptions,
  );

  abstract addInfoWindow(infoWindow: NgMapsInfoWindowComponent): Promise<void>;

  /**
   * Creates a Google Maps event listener for the given InfoWindow as an Observable
   */
  abstract createEventObservable<E>(
    eventName: string,
    infoWindow: NgMapsInfoWindowComponent,
  ): Observable<E>;
}
