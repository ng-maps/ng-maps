import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgMapsCoreModule } from '@ng-maps/core';
import { GOOGLE_MAPS_API_CONFIG, NgMapsGoogleModule } from '@ng-maps/google';
import {
  MARKER_CLUSTER_CONFIG,
  NgMapsMarkerClustererModule,
} from '@ng-maps/marker-clusterer';
import { NgMapsPlacesModule } from '@ng-maps/places';
import { NgMapsSnazzyInfoWindowModule } from '@ng-maps/snazzy-info-window';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { BoundsPaddingComponent } from './bounds-padding/bounds-padding.component';
import { ClusterComponent } from './cluster/cluster.component';
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
  ],
  providers: [
    {
      provide: GOOGLE_MAPS_API_CONFIG,
      useValue: {
        apiKey: 'AIzaSyAtee0zgzh-_8JgWoRXFf2Lac61vkk0GZc',
      },
    },
    {
      provide: MARKER_CLUSTER_CONFIG,
      useValue: {
        imagePath: '/assets/images/m',
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
