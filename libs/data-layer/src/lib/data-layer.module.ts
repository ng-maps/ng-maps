import { NgModule } from '@angular/core';

import { NgMapsCoreModule } from '@ng-maps/core';

import { NgMapsDataLayer } from './data-layer';

@NgModule({
  declarations: [NgMapsDataLayer],
  imports: [NgMapsCoreModule],
  exports: [NgMapsDataLayer],
  providers: [],
})
export class NgMapsDataLayerModule {}
