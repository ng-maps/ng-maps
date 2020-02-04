import { ModuleWithProviders, NgModule } from '@angular/core';
import { MAP_PROVIDER, MapsAPILoader } from '@ng-maps/core';
import { GoogleMapsScriptLoader } from './google-maps-script-loader.service';
import { GoogleComponent } from './google.component';
import { GOOFLE_MAPS_API_CONFIG, GoogleModuleOptions } from './options';

@NgModule({
  declarations: [GoogleComponent],
  imports: [],
  exports: [GoogleComponent],
})
export class NgMapsGoogleModule {
  static forRoot(
    loaderOptions?: GoogleModuleOptions,
  ): ModuleWithProviders<NgMapsGoogleModule> {
    return {
      ngModule: NgMapsGoogleModule,
      providers: [
        { provide: MapsAPILoader, useClass: GoogleMapsScriptLoader },
        { provide: GOOFLE_MAPS_API_CONFIG, useValue: loaderOptions },
        {
          provide: MAP_PROVIDER,
          useValue: 'GoogleMaps',
        },
      ],
    };
  }
}
