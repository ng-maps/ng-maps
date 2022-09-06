import { ModuleWithProviders, NgModule } from '@angular/core';

import { NgMapsCoreModule } from '@ng-maps/core';
import { MARKER_CLUSTER_CONFIG, MarkerClusterConfig } from './config';

import { MarkerClusterComponent } from './directives/marker-cluster';

@NgModule({
  imports: [NgMapsCoreModule],
  declarations: [MarkerClusterComponent],
  exports: [MarkerClusterComponent],
})
export class NgMapsMarkerClustererModule {
  /**
   * configure the NgMapsMarkerClustererModule with a value
   * @param config
   */
  public static forRoot(
    config: MarkerClusterConfig,
  ): ModuleWithProviders<NgMapsMarkerClustererModule> {
    return {
      ngModule: NgMapsMarkerClustererModule,
      providers: [
        {
          provide: MARKER_CLUSTER_CONFIG,
          useValue: config,
        },
      ],
    };
  }

  /**
   * configure the NgMapsMarkerClustererModule with a factory
   * @param factory
   * @param deps
   */
  public static forRootFactory(
    factory: (...args: Array<any>) => MarkerClusterConfig,
    deps?: Array<any>,
  ): ModuleWithProviders<NgMapsMarkerClustererModule> {
    return {
      ngModule: NgMapsMarkerClustererModule,
      providers: [
        {
          provide: MARKER_CLUSTER_CONFIG,
          useFactory: factory,
          deps,
        },
      ],
    };
  }
}
