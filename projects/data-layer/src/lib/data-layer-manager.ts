import { Injectable, NgZone } from '@angular/core';
import { NgMapsViewComponent } from '@ng-maps/core';
import { GoogleMapsAPIWrapper } from '@ng-maps/google';
import { Observable, Observer } from 'rxjs';
import { NgMapsDataLayer } from './data-layer';

/**
 * Manages all Data Layers for a Google Map instance.
 */
@Injectable({
  providedIn: NgMapsViewComponent,
})
export class DataLayerManager {
  private _layers: Map<NgMapsDataLayer, google.maps.Data> = new Map<
    NgMapsDataLayer,
    google.maps.Data
  >();

  constructor(private _wrapper: GoogleMapsAPIWrapper, private _zone: NgZone) {}

  /**
   * Adds a new Data Layer to the map.
   */
  async addDataLayer(layer: NgMapsDataLayer) {
    const d = await this._wrapper.createDataLayer({
      style: layer.style,
    });
    if (layer.geoJson) {
      const features = await this.getDataFeatures(d, layer.geoJson);
    }
    this._layers.set(layer, d);
  }

  deleteDataLayer(layer: NgMapsDataLayer) {
    const l = this._layers.get(layer);
    l.setMap(null);
    this._layers.delete(layer);
  }

  async updateGeoJson(layer: NgMapsDataLayer, geoJson: Object | string) {
    const l = await this._layers.get(layer);
    l.forEach((feature: google.maps.Data.Feature) => {
      l.remove(feature);

      const index = l.features.indexOf(feature, 0);
      if (index > -1) {
        l.features.splice(index, 1);
      }
    });
    l.features = await this.getDataFeatures(l, geoJson);
  }

  setDataOptions(
    layer: NgMapsDataLayer,
    options: google.maps.Data.DataOptions,
  ) {
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
    layer: NgMapsDataLayer,
  ): Observable<T> {
    return new Observable((observer: Observer<T>) => {
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
   */
  getDataFeatures(
    d: google.maps.Data,
    geoJson: Object | string,
  ): Promise<Array<google.maps.Data.Feature>> {
    return new Promise<google.maps.Data.Feature[]>((resolve, reject) => {
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
