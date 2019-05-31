import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgMapsCoreModule } from '@ng-maps/core';
import { NgMapsMarkerClustererModule } from '@ng-maps/marker-clusterer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimpleMapComponent } from './simple-map/simple-map.component';
import { ClusterComponent } from './cluster/cluster.component';
import { InfoWindowComponent } from './info-window/info-window.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleMapComponent,
    ClusterComponent,
    InfoWindowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgMapsCoreModule.forRoot({
      apiKey: 'AIzaSyAtee0zgzh-_8JgWoRXFf2Lac61vkk0GZc'
    }),
    NgMapsMarkerClustererModule.forRoot({
      imagePath: '/assets/images/m'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
