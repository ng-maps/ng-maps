import { Injectable, NgZone } from '@angular/core';

import * as MarkerClusterer from '@google/markerclusterer';

import { GoogleMapsAPIWrapper, MarkerManager, NgMapsMarkerComponent, NgMapsViewComponent } from '@ng-maps/core';
import { MarkerClusterComponent } from '../../directives/marker-cluster';
import { ClusterOptions, MarkerClustererInstance } from '../../types';

@Injectable({
  providedIn: NgMapsViewComponent
})
export class ClusterManager extends MarkerManager {
  private _clustererInstance: Promise<MarkerClustererInstance>;
  private _resolver: Function;

  constructor(protected _mapsWrapper: GoogleMapsAPIWrapper, protected _zone: NgZone) {
    super(_mapsWrapper, _zone);
    this._clustererInstance = new Promise<MarkerClustererInstance>((resolver) => {
      this._resolver = resolver;
    });
  }

  async init(options: ClusterOptions): Promise<void> {
    const map = await this._mapsWrapper.getNativeMap();
    this._resolver(new MarkerClusterer(map, [], options));
  }

  async addMarker(marker: NgMapsMarkerComponent): Promise<void> {
    const cluster: MarkerClustererInstance = await this._clustererInstance;
    const markers = await this._mapsWrapper
      .createMarker({
        position: {
          lat: marker.latitude,
          lng: marker.longitude
        },
        label: marker.label,
        draggable: marker.draggable,
        icon: marker.iconUrl,
        opacity: marker.opacity,
        visible: marker.visible,
        zIndex: marker.zIndex,
        title: marker.title,
        clickable: marker.clickable,
      }, false);
    cluster.addMarker(markers);
    this._markers.set(marker, markers);
  }

  deleteMarker(marker: NgMapsMarkerComponent): Promise<void> {
    const m = this._markers.get(marker);
    if (m == null) {
      // marker already deleted
      return Promise.resolve();
    }
    this._zone.run(() => {
      m.setMap(null);
      this._clustererInstance.then(cluster => {
        cluster.removeMarker(m);
        this._markers.delete(marker);
      });
    });
  }

  clearMarkers(): Promise<void> {
    return this._clustererInstance.then(cluster => {
      cluster.clearMarkers();
    });
  }

  setGridSize(c: MarkerClusterComponent): void {
    this._clustererInstance.then(cluster => {
      cluster.setGridSize(c.gridSize);
    });
  }

  setMaxZoom(c: MarkerClusterComponent): void {
    this._clustererInstance.then(cluster => {
      cluster.setMaxZoom(c.maxZoom);
    });
  }

  setStyles(c: MarkerClusterComponent): void {
    this._clustererInstance.then(cluster => {
      cluster.setStyles(c.styles);
    });
  }

  setZoomOnClick(c: MarkerClusterComponent): void {
    this._clustererInstance.then(cluster => {
      if (c.zoomOnClick !== undefined) {
        cluster.zoomOnClick_ = c.zoomOnClick;
      }
    });
  }

  setAverageCenter(c: MarkerClusterComponent): void {
    this._clustererInstance.then(cluster => {
      if (c.averageCenter !== undefined) {
        cluster.averageCenter_ = c.averageCenter;
      }
    });
  }

  setImagePath(c: MarkerClusterComponent): void {
    this._clustererInstance.then(cluster => {
      if (c.imagePath !== undefined) {
        cluster.imagePath_ = c.imagePath;
      }
    });
  }

  setMinimumClusterSize(c: MarkerClusterComponent): void {
    this._clustererInstance.then(cluster => {
      if (c.minimumClusterSize !== undefined) {
        cluster.minimumClusterSize_ = c.minimumClusterSize;
      }
    });
  }

  setImageExtension(c: MarkerClusterComponent): void {
    this._clustererInstance.then(cluster => {
      if (c.imageExtension !== undefined) {
        cluster.imageExtension_ = c.imageExtension;
      }
    });
  }
}
