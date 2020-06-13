import { Injectable, NgZone } from '@angular/core';

import {
  MapsApiWrapper,
  NgMapsMarkerComponent,
  NgMapsViewComponent,
} from '@ng-maps/core';
import { Observable, Observer } from 'rxjs';
import { MarkerClusterComponent } from './marker-cluster';
import { HereMapsMarkerManager } from '../here-maps-marker.manager';

@Injectable({
  providedIn: NgMapsViewComponent,
})
export class ClusterManager extends HereMapsMarkerManager {
  private _clustererInstance: Promise<H.clustering.Provider>;
  private _resolver: Function;

  constructor(protected _mapsWrapper: MapsApiWrapper, protected _zone: NgZone) {
    super();
    this._clustererInstance = new Promise<H.clustering.Provider>((resolver) => {
      this._resolver = resolver;
    });
  }

  async init(options: H.clustering.Provider.Options): Promise<void> {
    const map = await this._mapsWrapper.getNativeMap();
    this._resolver(new H.clustering.Provider([], options));
  }

  /**
   * @todo fix commented options
   * @param marker
   */
  async addMarker(marker: NgMapsMarkerComponent): Promise<void> {
    const cluster: H.clustering.Provider = await this._clustererInstance;
    const markers: H.map.Marker = await this._mapsWrapper.createMarker(
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
        // clickable: marker.clickable,
      },
      false,
    );
    // cluster.addDataPoint(markers.get);
    this._markers.set(marker, markers);
  }

  deleteMarker(marker: NgMapsMarkerComponent): Promise<void> {
    const m: H.map.Marker = this._markers.get(marker);
    if (m == null) {
      // marker already deleted
      return Promise.resolve();
    }
    this._zone.run(() => {
      // m.setMap(null);
      this._clustererInstance.then((cluster) => {
        // cluster.removeDataPoint(m.getPosition());
        this._markers.delete(marker);
      });
    });
  }

  clearMarkers(): Promise<void> {
    return this._clustererInstance.then((cluster) => {
      cluster.dispose();
    });
  }

  setGridSize(c: MarkerClusterComponent): void {
    this._clustererInstance.then((cluster) => {
      // cluster.setGridSize(c.gridSize);
    });
  }

  setMaxZoom(c: MarkerClusterComponent): void {
    this._clustererInstance.then((cluster) => {
      // cluster.setMaxZoom(c.maxZoom);
    });
  }

  setStyles(c: MarkerClusterComponent): void {
    this._clustererInstance.then((cluster) => {
      // cluster.setStyles(c.styles);
    });
  }

  setZoomOnClick(c: MarkerClusterComponent): void {
    this._clustererInstance.then((cluster) => {
      if (c.zoomOnClick !== undefined) {
        // cluster.zoomOnClick_ = c.zoomOnClick;
      }
    });
  }

  setAverageCenter(c: MarkerClusterComponent): void {
    this._clustererInstance.then((cluster) => {
      if (c.averageCenter !== undefined) {
        // cluster.averageCenter_ = c.averageCenter;
      }
    });
  }

  setImagePath(c: MarkerClusterComponent): void {
    this._clustererInstance.then((cluster) => {
      if (c.imagePath !== undefined) {
        // cluster.imagePath_ = c.imagePath;
      }
    });
  }

  setMinimumClusterSize(c: MarkerClusterComponent): void {
    this._clustererInstance.then((cluster) => {
      if (c.minimumClusterSize !== undefined) {
        cluster.min = c.minimumClusterSize;
      }
    });
  }

  setImageExtension(c: MarkerClusterComponent): void {
    this._clustererInstance.then((cluster) => {
      if (c.imageExtension !== undefined) {
        // cluster.imageExtension_ = c.imageExtension;
      }
    });
  }

  createClusterEventObservable<T extends Event>(
    eventName: string,
    marker: MarkerClusterComponent,
  ): Observable<T> {
    return new Observable<T>((observer: Observer<T>) => {
      this._clustererInstance.then((p: H.clustering.Provider) => {
        p.addEventListener(eventName, (e: T) =>
          this._zone.run(() => observer.next(e)),
        );
      });
    });
  }
}
