import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { NgMapsCoreModule } from '@ng-maps/core';
import { GOOGLE_MAPS_API_CONFIG, NgMapsGoogleModule } from '@ng-maps/google';
import { NgMapsDirectionModule } from '@ng-maps/direction';
import { NgMapsMarkerClustererModule } from '@ng-maps/marker-clusterer';
import { NgMapsPlacesModule } from '@ng-maps/places';
import { NgMapsSnazzyInfoWindowModule } from '@ng-maps/snazzy-info-window';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { BoundsPaddingComponent } from './bounds-padding/bounds-padding.component';
import { ClusterWithWindowComponent } from './cluster-with-window/cluster-with-window.component';
import { ClusterComponent } from './cluster/cluster.component';
import { DirectionComponent } from './direction/direction.component';
import { FitBoundsComponent } from './fit-bounds/fit-bounds.component';
import { InfoWindowComponent } from './info-window/info-window.component';
import { LayersComponent } from './layers/layers.component';
import { ShapesComponent } from './shapes/shapes.component';
import { SimpleMapComponent } from './simple-map/simple-map.component';
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
    BoundsPaddingComponent,
    ClusterWithWindowComponent,
    DirectionComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgMapsCoreModule,
    NgMapsGoogleModule,
    NgMapsMarkerClustererModule,
    NgMapsPlacesModule,
    NgMapsSnazzyInfoWindowModule,
    NgMapsDirectionModule,
  ],
  providers: [
    {
      provide: GOOGLE_MAPS_API_CONFIG,
      useValue: {
        apiKey: 'AIzaSyAtee0zgzh-_8JgWoRXFf2Lac61vkk0GZc',
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
