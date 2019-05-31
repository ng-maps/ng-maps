import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgMapsCoreModule } from '@ng-maps/core';
import { NgMapsMarkerClustererModule } from '@ng-maps/marker-clusterer';
import { NgMapsShapesModule } from '@ng-maps/shapes';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimpleMapComponent } from './simple-map/simple-map.component';
import { ClusterComponent } from './cluster/cluster.component';
import { InfoWindowComponent } from './info-window/info-window.component';
import { ShapesComponent } from './shapes/shapes.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleMapComponent,
    ClusterComponent,
    InfoWindowComponent,
    ShapesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgMapsCoreModule.forRoot({
      apiKey: 'AIzaSyAtee0zgzh-_8JgWoRXFf2Lac61vkk0GZc'
    }),
    NgMapsMarkerClustererModule.forRoot({
      imagePath: '/assets/images/m'
    }),
    NgMapsShapesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
