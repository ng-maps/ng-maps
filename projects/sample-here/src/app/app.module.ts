import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgMapsCoreModule } from '@ng-maps/core';
import { HereMapsLibraries, NgMapsHereModule } from '@ng-maps/here';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgMapsCoreModule.forRoot(),
    NgMapsHereModule.forRoot({
      platformOptions: {
        apikey: 'NIetcbVFNgfAE7pK2CPNf5hqXiBVNyIfNgFqZha1BL4',
      },
      libraries: [HereMapsLibraries.MAPEVENTS, HereMapsLibraries.UI],
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
