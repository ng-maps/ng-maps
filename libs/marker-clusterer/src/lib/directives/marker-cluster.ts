import {
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Algorithm, Cluster, Renderer } from '@googlemaps/markerclusterer';

import { InfoWindowManager, MarkerManager } from '@ng-maps/core';
import { GoogleInfoWindowManager } from '@ng-maps/google';

import { ClusterManager } from '../services/managers/cluster-manager';

/**
 * MarkerClusterComponent clusters map marker if they are near together
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'map-marker-cluster',
  providers: [
    ClusterManager,
    { provide: MarkerManager, useExisting: ClusterManager },
    { provide: InfoWindowManager, useClass: GoogleInfoWindowManager },
  ],
  standalone: false,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class MarkerClusterComponent implements OnDestroy, OnChanges, OnInit {
  /**
   * see {@link https://googlemaps.github.io/js-markerclusterer/interfaces/Algorithm.html}
   */
  @Input() public algorithm?: Algorithm;
  /**
   * see {@link https://googlemaps.github.io/js-markerclusterer/interfaces/Renderer.html}
   */
  @Input() public renderer?: Renderer;

  @Output()
  public clusterClick: EventEmitter<{
    event: google.maps.MapMouseEvent;
    cluster: Cluster;
    map: google.maps.Map;
  }> = new EventEmitter<{
    event: google.maps.MapMouseEvent;
    cluster: Cluster;
    map: google.maps.Map;
  }>();
  constructor(private _clusterManager: ClusterManager) {}

  /** @internal */
  public ngOnDestroy() {
    this._clusterManager.clearMarkers();
  }

  /** @internal */
  public ngOnChanges(changes: SimpleChanges) {
    if (changes['algorithm'] || changes['renderer']) {
      this.updateClusterManager();
    }
  }

  /** @internal */
  public ngOnInit() {
    this.updateClusterManager();
  }

  private updateClusterManager() {
    this._clusterManager.createCluster({
      algorithm: this.algorithm,
      renderer: this.renderer,
      onClusterClick: (
        event: google.maps.MapMouseEvent,
        cluster: Cluster,
        map: google.maps.Map,
      ) => this.clusterClick.emit({ event, cluster, map }),
    });
  }
}
