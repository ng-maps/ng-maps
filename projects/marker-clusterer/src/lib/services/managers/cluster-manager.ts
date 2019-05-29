import { Injectable, NgZone } from '@angular/core';

import '@google/markerclusterer';

import { AgmMarker, GoogleMapsAPIWrapper, MarkerManager } from '@ng-maps/core';
import { MarkerClusterComponent } from '../../directives/marker-cluster';
import { ClusterOptions, MarkerClustererInstance } from '../../types';

declare var MarkerClusterer: any;

@Injectable()
export class ClusterManager extends MarkerManager {
  private _clustererInstance: Promise<MarkerClustererInstance>;
  private _resolver: Function;

  constructor(protected _mapsWrapper: GoogleMapsAPIWrapper, protected _zone: NgZone) {
    super(_mapsWrapper, _zone);
    this._clustererInstance = new Promise<MarkerClustererInstance>((resolver) => {
      this._resolver = resolver;
    });
  }

  init(options: ClusterOptions): void {
    this._mapsWrapper.getNativeMap().then(map => {
      const clusterer = new MarkerClusterer(map, [], options);
      this._resolver(clusterer);
    });
  }

  addMarker(marker: AgmMarker): void {
    const clusterPromise: Promise<MarkerClustererInstance> = this._clustererInstance;
    const markerPromise = this._mapsWrapper
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

    Promise
      .all([clusterPromise, markerPromise])
      .then(([cluster, markers]) => {
        return cluster.addMarker(markers);
      });
    this._markers.set(marker, markerPromise);
  }

  deleteMarker(marker: AgmMarker): Promise<void> {
    const m = this._markers.get(marker);
    if (m == null) {
      // marker already deleted
      return Promise.resolve();
    }
    return m.then((m: google.maps.Marker) => {
      this._zone.run(() => {
        m.setMap(null);
        this._clustererInstance.then(cluster => {
          cluster.removeMarker(m);
          this._markers.delete(marker);
        });
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
