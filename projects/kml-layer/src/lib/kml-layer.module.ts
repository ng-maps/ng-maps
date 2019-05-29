import { NgModule } from '@angular/core';
import { AgmKmlLayer } from './kml-layer';
import { KmlLayerManager } from './kml-layer-manager';

@NgModule({
  declarations: [AgmKmlLayer],
  imports: [
  ],
  providers: [KmlLayerManager],
  exports: [AgmKmlLayer]
})
export class KmlLayerModule { }
