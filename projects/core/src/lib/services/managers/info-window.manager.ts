import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { NgMapsInfoWindowComponent } from '../../directives/info-window';
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

  public abstract deleteInfoWindow(
    infoWindow: NgMapsInfoWindowComponent,
  ): Promise<void>;

  public abstract setPosition(infoWindow: NgMapsInfoWindowComponent): void;

  public abstract setZIndex(infoWindow: NgMapsInfoWindowComponent): void;

  public abstract open(
    infoWindow: NgMapsInfoWindowComponent,
    event?: any,
  ): Promise<void>;

  public abstract close(infoWindow: NgMapsInfoWindowComponent): void;

  public abstract setOptions(
    infoWindow: NgMapsInfoWindowComponent,
    options: google.maps.InfoWindowOptions,
  );

  public abstract addInfoWindow(
    infoWindow: NgMapsInfoWindowComponent,
  ): Promise<void>;

  /**
   * Creates a Google Maps event listener for the given InfoWindow as an Observable
   */
  public abstract createEventObservable<E>(
    eventName: string,
    infoWindow: NgMapsInfoWindowComponent,
  ): Observable<E>;
}
