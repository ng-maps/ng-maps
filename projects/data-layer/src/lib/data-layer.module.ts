import { NgModule } from '@angular/core';
import { AgmDataLayer } from './data-layer';
import { DataLayerManager } from './data-layer-manager';

@NgModule({
  declarations: [AgmDataLayer],
  imports: [],
  exports: [AgmDataLayer],
  providers: [DataLayerManager]
})
export class DataLayerModule {
}
