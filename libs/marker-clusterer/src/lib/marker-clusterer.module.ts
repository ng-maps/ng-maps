import { NgModule } from '@angular/core';
import { NgMapsCoreModule } from '@ng-maps/core';
import { MarkerClusterComponent } from './directives/marker-cluster';

@NgModule({
  imports: [NgMapsCoreModule],
  declarations: [MarkerClusterComponent],
  exports: [MarkerClusterComponent],
})
export class NgMapsMarkerClustererModule {}
