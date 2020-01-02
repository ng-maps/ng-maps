import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LAZY_MAPS_API_CONFIG, NgMapsCoreModule } from '@ng-maps/core';
import { NgMapsMarkerClustererModule } from '@ng-maps/marker-clusterer';
import { NgMapsShapesModule } from '@ng-maps/shapes';
import { NgMapsPlacesModule } from '@ng-maps/places';
import { NgMapsSnazzyInfoWindowModule } from '@ng-maps/snazzy-info-window';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ClusterComponent } from './cluster/cluster.component';
import { FitBoundsComponent } from './fit-bounds/fit-bounds.component';
import { InfoWindowComponent } from './info-window/info-window.component';
import { configFactory } from './maps-config-factory';
import { ShapesComponent } from './shapes/shapes.component';
import { SimpleMapComponent } from './simple-map/simple-map.component';
import { LayersComponent } from './layers/layers.component';
import { SnazzyInfoWindowComponent } from './snazzy-info-window/snazzy-info-window.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleMapComponent,
    ClusterComponent,
    InfoWindowComponent,
    ShapesComponent,
    FitBoundsComponent,
    AutocompleteComponent,
    LayersComponent,
    SnazzyInfoWindowComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgMapsCoreModule.forRoot(),
    NgMapsMarkerClustererModule.forRoot({
      imagePath: '/assets/images/m',
    }),
    NgMapsShapesModule,
    NgMapsPlacesModule,
    NgMapsSnazzyInfoWindowModule,
  ],
  providers: [
    {
      provide: LAZY_MAPS_API_CONFIG,
      useFactory: configFactory,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
