import { NgModule } from '@angular/core';
import { MapsAPILoader, MAP_PROVIDER } from '@ng-maps/core';
import { GoogleMapsScriptLoader } from './google-maps-script-loader.service';
import { GoogleComponent } from './google.component';

@NgModule({
  declarations: [GoogleComponent],
  imports: [],
  exports: [GoogleComponent],
  providers: [
    { provide: MapsAPILoader, useClass: GoogleMapsScriptLoader },
    {
      provide: MAP_PROVIDER,
      useValue: 'GoogleMaps',
    },
  ],
})
export class NgMapsGoogleModule {}
