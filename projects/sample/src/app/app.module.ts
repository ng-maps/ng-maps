import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgMapsCoreModule } from '@ng-maps/core';
import { NgMapsMarkerClustererModule } from '@ng-maps/marker-clusterer';
import { NgMapsShapesModule } from '@ng-maps/shapes';
import { NgMapsPlacesModule } from '@ng-maps/places';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ClusterComponent } from './cluster/cluster.component';
import { FitBoundsComponent } from './fit-bounds/fit-bounds.component';
import { InfoWindowComponent } from './info-window/info-window.component';
import { ShapesComponent } from './shapes/shapes.component';
import { SimpleMapComponent } from './simple-map/simple-map.component';
import { LayersComponent } from './layers/layers.component';

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
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgMapsCoreModule.forRoot({
      apiKey: 'AIzaSyAtee0zgzh-_8JgWoRXFf2Lac61vkk0GZc',
    }),
    NgMapsMarkerClustererModule.forRoot({
      imagePath: '/assets/images/m',
    }),
    NgMapsShapesModule,
    NgMapsPlacesModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
