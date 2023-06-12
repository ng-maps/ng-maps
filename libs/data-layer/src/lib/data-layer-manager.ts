import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { NgMapsViewComponent } from '@ng-maps/core';
import { GoogleMapsAPIWrapper } from '@ng-maps/google';

import { NgMapsDataLayerDirective } from './data-layer';

/**
 * Manages all Data Layers for a Google Map instance.
 *
 * TODO needs to be fixed, look for ts-ignore
 */
@Injectable({
  providedIn: NgMapsViewComponent,
})
export class DataLayerManager {
  private _layers: Map<NgMapsDataLayerDirective, google.maps.Data> = new Map<
    NgMapsDataLayerDirective,
    google.maps.Data
  >();

  constructor(private _wrapper: GoogleMapsAPIWrapper, private _zone: NgZone) {}

  /**
   * Adds a new Data Layer to the map.
   */
  async addDataLayer(layer: NgMapsDataLayerDirective) {
    const map = await this._wrapper.getNativeMap();
    const d = await this._wrapper.createDataLayer({
      map,
      style: layer.style,
    });
    if (layer.geoJson) {
      const features = await this.getDataFeatures(d, layer.geoJson);
    }
    this._layers.set(layer, d);
  }

  deleteDataLayer(layer: NgMapsDataLayerDirective) {
    const l = this._layers.get(layer);
    l.setMap(null);
    this._layers.delete(layer);
  }

  /**
   *
   * @param layer
   * @param geoJson
   * @todo typings
   */
  async updateGeoJson(
    layer: NgMapsDataLayerDirective,
    geoJson: Record<any, any> | string,
  ) {
    const l = await this._layers.get(layer);
    l.forEach((feature: google.maps.Data.Feature) => {
      l.remove(feature);

      // FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const index = l.features.indexOf(feature, 0);
      if (index > -1) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        l.features.splice(index, 1);
      }
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    l.features = await this.getDataFeatures(l, geoJson);
  }

  setDataOptions(
    layer: NgMapsDataLayerDirective,
    options: google.maps.Data.DataOptions,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._layers.get(layer).then((l) => {
      l.setControlPosition(options.controlPosition);
      l.setControls(options.controls);
      l.setDrawingMode(options.drawingMode);
      l.setStyle(options.style);
    });
  }

  /**
   * Creates a Google Maps event listener for the given DataLayer as an Observable
   */
  createEventObservable<T>(
    eventName: string,
    layer: NgMapsDataLayerDirective,
  ): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._layers.get(layer).then((d: google.maps.Data) => {
        d.addListener(eventName, (e: T) =>
          this._zone.run(() => observer.next(e)),
        );
      });
    });
  }

  /**
   * Extract features from a geoJson using google.maps Data Class
   * @param d : google.maps.Data class instance
   * @param geoJson : url or geojson object
   * @todo typings
   */
  getDataFeatures(
    d: google.maps.Data,
    geoJson: Record<any, any> | string,
  ): Promise<Array<google.maps.Data.Feature>> {
    return new Promise<Array<google.maps.Data.Feature>>((resolve, reject) => {
      if (typeof geoJson === 'object') {
        try {
          const features = d.addGeoJson(geoJson);
          resolve(features);
        } catch (e) {
          reject(e);
        }
      } else if (typeof geoJson === 'string') {
        d.loadGeoJson(geoJson, null, resolve);
      } else {
        reject(
          `Impossible to extract features from geoJson: wrong argument type`,
        );
      }
    });
  }
}
