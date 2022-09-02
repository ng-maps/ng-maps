import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgMapsCoreModule } from '@ng-maps/core';
import {
  HereMapsLibraries,
  HERE_MAPS_MODULE_OPTIONS,
  NgMapsHereModule,
} from '@ng-maps/here';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgMapsCoreModule,
    NgMapsHereModule,
  ],
  providers: [
    {
      provide: HERE_MAPS_MODULE_OPTIONS,
      useValue: {
        platformOptions: {
          apikey: 'NIetcbVFNgfAE7pK2CPNf5hqXiBVNyIfNgFqZha1BL4',
        },
        libraries: [HereMapsLibraries.MAPEVENTS, HereMapsLibraries.UI],
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
