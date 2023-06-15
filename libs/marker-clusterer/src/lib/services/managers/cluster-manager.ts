import { Injectable, NgZone } from '@angular/core';
import {
  MarkerClusterer,
  MarkerClustererOptions,
} from '@googlemaps/markerclusterer';
import { Observable, Observer } from 'rxjs';

import {
  MapsApiWrapper,
  NgMapsMarkerComponent,
  NgMapsViewComponent,
} from '@ng-maps/core';
import { GoogleMapsMarkerManager } from '@ng-maps/google';

import { MarkerClusterComponent } from '../../directives/marker-cluster';

@Injectable({
  providedIn: NgMapsViewComponent,
})
export class ClusterManager extends GoogleMapsMarkerManager {
  private _clustererInstance: Promise<MarkerClusterer>;
  private _resolver?: (value?: any) => void;
  constructor(_mapsWrapper: MapsApiWrapper, _zone: NgZone) {
    super(_mapsWrapper, _zone);
    this._clustererInstance = new Promise<MarkerClusterer>((resolver) => {
      this._resolver = resolver;
    });
  }

  public async createCluster(options: MarkerClustererOptions): Promise<void> {
    const map = await this._mapsWrapper.getNativeMap();
    if (this._resolver) {
      this._resolver(
        new MarkerClusterer({
          map,
          markers: [...this._markers.values()],
          ...options,
        }),
      );
    }
  }

  /**
   * @todo fix commented options
   * @param marker
   */
  public override async addMarker(
    marker: NgMapsMarkerComponent,
  ): Promise<void> {
    if (
      typeof marker.latitude !== 'number' ||
      typeof marker.longitude !== 'number'
    ) {
      return;
    }

    const cluster: MarkerClusterer = await this._clustererInstance;
    const markers = await this._mapsWrapper.createMarker(
      {
        lat: marker.latitude,
        lng: marker.longitude,
      },
      {
        label: marker.label,
        // draggable: marker.draggable,
        // icon: marker.iconUrl,
        // opacity: marker.opacity,
        visible: marker.visible,
        zIndex: marker.zIndex,
        title: marker.title,
        clickable: marker.clickable,
      },
      false,
    );
    cluster.addMarker(markers);
    this._markers.set(marker, markers);
  }

  public override async deleteMarker(
    marker: NgMapsMarkerComponent,
  ): Promise<void> {
    const m = this._markers.get(marker);
    if (m == null) {
      // marker already deleted
      return Promise.resolve();
    }
    this._zone.run(() => {
      m.setMap(null);
      this._clustererInstance.then((cluster) => {
        cluster.removeMarker(m);
        this._markers.delete(marker);
      });
    });
  }

  public clearMarkers(): Promise<void> {
    return this._clustererInstance.then((cluster) => {
      cluster.clearMarkers();
    });
  }

  public createClusterEventObservable<T>(
    eventName: string,
    marker: MarkerClusterComponent,
  ): Observable<T> {
    return new Observable<T>((observer: Observer<T>) => {
      this._clustererInstance.then((m: MarkerClusterer) => {
        m.addListener(eventName, (e: T) =>
          this._zone.run(() => observer.next(e)),
        );
      });
    });
  }
}
