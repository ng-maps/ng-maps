import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
} from '@angular/core';
import { InfoWindowManager, MarkerManager } from '@ng-maps/core';
import { Subscription } from 'rxjs';
import { MarkerClusterConfig, MARKER_CLUSTER_CONFIG } from './cluster-config';
import { ClusterManager } from './cluster-manager';
import { Calculator, MarkerClustererOptions } from './cluster-options';

/**
 * MarkerClusterComponent clusters map marker if they are near together
 */
@Directive({
  selector: 'map-marker-cluster',
  providers: [
    ClusterManager,
    { provide: MarkerManager, useExisting: ClusterManager },
  ],
})
export class MarkerClusterComponent
  implements OnDestroy, OnChanges, OnInit, MarkerClustererOptions
{
  /**
   * Whether the center of each cluster should be the average of all markers in the cluster.
   */
  @Input() averageCenter: boolean;

  /**
   * A function that calculates the cluster style and text based on the markers in the cluster.
   */
  @Input() calculator: Calculator;

  /**
   * The grid size of a cluster in pixels
   */
  @Input() gridSize: number;

  @Input() imageExtension: string;
  @Input() imagePath: string;

  /**
   * The maximum zoom level that a marker can be part of a cluster.
   */
  @Input() maxZoom: number;

  /**
   * The minimum number of markers to be in a cluster before the markers are hidden and a count is shown.
   */
  @Input() minimumClusterSize: number;

  /**
   * An object that has style properties.
   * @todo specify type
   */
  @Input() styles: Array<any>;

  /**
   * Whether the default behaviour of clicking on a cluster is to zoom into it.
   */
  @Input() zoomOnClick: boolean;

  @Output()
  clusterClick: EventEmitter<google.maps.MapMouseEvent> =
    new EventEmitter<google.maps.MapMouseEvent>();

  private _observableSubscriptions: Array<Subscription> = [];

  constructor(
    @Optional()
    @Inject(MARKER_CLUSTER_CONFIG)
    private _config: MarkerClusterConfig = null,
    private _clusterManager: ClusterManager,
  ) {}

  /** @internal */
  ngOnDestroy() {
    this._clusterManager.clearMarkers();
    this._observableSubscriptions.forEach((s) => s.unsubscribe());
  }

  /** @internal */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.averageCenter) {
      this._clusterManager.setAverageCenter(this);
    }
    if (changes.gridSize) {
      this._clusterManager.setGridSize(this);
    }
    if (changes.imageExtension) {
      this._clusterManager.setImageExtension(this);
    }
    if (changes.imagePath) {
      this._clusterManager.setImagePath(this);
    }
    if (changes.maxZoom) {
      this._clusterManager.setMaxZoom(this);
    }
    if (changes.minimumClusterSize) {
      this._clusterManager.setMinimumClusterSize(this);
    }
    if (changes.styles) {
      this._clusterManager.setStyles(this);
    }
    if (changes.zoomOnClick) {
      this._clusterManager.setZoomOnClick(this);
    }
  }

  private _addEventListeners() {
    const handlers = [
      {
        name: 'clusterclick',
        handler: (ev: google.maps.MapMouseEvent) => this.clusterClick.emit(ev),
      },
    ];
    handlers.forEach((obj) => {
      const os = this._clusterManager
        .createClusterEventObservable(obj.name, this)
        // @fixme
        // @ts-ignore
        .subscribe(obj.handler);
      this._observableSubscriptions.push(os);
    });
  }

  /**
   * @todo rework typings
   * @internal
   */
  ngOnInit() {
    this._addEventListeners();
    this._clusterManager.init({
      averageCenter: this.averageCenter,
      calculator: this.calculator,
      gridSize: this.gridSize,
      imageExtension: this.imageExtension,
      imagePath:
        this.imagePath == null && this._config != null
          ? this._config.imagePath
          : this.imagePath,
      maxZoom: this.maxZoom,
      minimumClusterSize: this.minimumClusterSize,
      styles: this.styles,
      zoomOnClick: this.zoomOnClick,
    } as any);
  }
}
