import { ModuleWithProviders, NgModule } from '@angular/core';
import { MAP_PROVIDER, MapsAPILoader } from '@ng-maps/core';
import { GoogleMapsScriptLoader } from './google-maps-script-loader.service';
import { GoogleComponent } from './google.component';
import { GoogleModuleOptions } from './options';

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
