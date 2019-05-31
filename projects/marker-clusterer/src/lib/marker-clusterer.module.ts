import { ModuleWithProviders, NgModule } from '@angular/core';
import { MARKER_CLUSTER_CONFIG, MarkerClusterConfig } from './config';
import { MarkerClusterComponent } from './directives/marker-cluster';

@NgModule({
  declarations: [MarkerClusterComponent],
  exports: [MarkerClusterComponent]
})
export class NgMapsMarkerClustererModule {
  /**
   * Please use this method when you register the module at the root level.
   */
  static forRoot(markerClusterConfig?: MarkerClusterConfig): ModuleWithProviders {
    return {
      ngModule: NgMapsMarkerClustererModule,
      providers: [
        {provide: MARKER_CLUSTER_CONFIG, useValue: markerClusterConfig}
      ],
    };
  }
}
