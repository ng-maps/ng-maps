import { NgModule } from '@angular/core';

import { NgMapsCoreModule } from '@ng-maps/core';

import { NgMapsDataLayerDirective } from './data-layer';

@NgModule({
  declarations: [NgMapsDataLayerDirective],
  imports: [NgMapsCoreModule],
  exports: [NgMapsDataLayerDirective],
  providers: [],
})
export class NgMapsDataLayerModule {}
