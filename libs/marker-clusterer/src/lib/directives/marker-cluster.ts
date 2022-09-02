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
import { Subscription } from 'rxjs';

import { InfoWindowManager, MarkerManager } from '@ng-maps/core';
import { GoogleInfoWindowManager } from '@ng-maps/google';

import { MarkerClusterConfig, MARKER_CLUSTER_CONFIG } from '../config';
import { ClusterManager } from '../services/managers/cluster-manager';

/**
 * MarkerClusterComponent clusters map marker if they are near together
 */
@Directive({
  selector: 'map-marker-cluster',
  providers: [
    ClusterManager,
    { provide: MarkerManager, useExisting: ClusterManager },
    { provide: InfoWindowManager, useClass: GoogleInfoWindowManager },
  ],
})
export class MarkerClusterComponent
  implements OnDestroy, OnChanges, OnInit, MarkerClustererOptions
{
  /**
   * Whether the center of each cluster should be the average of all markers in the cluster.
   */
  @Input() public averageCenter: boolean;

  /**
   * A function that calculates the cluster style and text based on the markers in the cluster.
   */
  @Input() public calculator: Calculator;

  /**
   * The grid size of a cluster in pixels
   */
  @Input() public gridSize: number;

  @Input() public imageExtension: string;
  @Input() public imagePath: string;

  /**
   * The maximum zoom level that a marker can be part of a cluster.
   */
  @Input() public maxZoom: number;

  /**
   * The minimum number of markers to be in a cluster before the markers are hidden and a count is shown.
   */
  @Input() public minimumClusterSize: number;

  /**
   * An object that has style properties.
   */
  @Input() public styles: Array<ClusterIconStyle>;

  /**
   * Whether the default behaviour of clicking on a cluster is to zoom into it.
   */
  @Input() public zoomOnClick: boolean;

  @Output()
  public clusterClick: EventEmitter<google.maps.MouseEvent> = new EventEmitter<google.maps.MouseEvent>();

  private _observableSubscriptions: Array<Subscription> = [];

  constructor(
    @Optional()
    @Inject(MARKER_CLUSTER_CONFIG)
    private _config: MarkerClusterConfig = null,
    private _clusterManager: ClusterManager,
  ) {}

  /** @internal */
  public ngOnDestroy() {
    this._clusterManager.clearMarkers();
    this._observableSubscriptions.forEach((s) => s.unsubscribe());
  }

  /** @internal */
  public ngOnChanges(changes: SimpleChanges) {
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
        handler: (ev: google.maps.MouseEvent) => this.clusterClick.emit(ev),
      },
    ];
    handlers.forEach((obj) => {
      const os = this._clusterManager
        .createClusterEventObservable(obj.name, this)
        .subscribe(obj.handler);
      this._observableSubscriptions.push(os);
    });
  }

  /** @internal */
  public ngOnInit() {
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
    });
  }
}
