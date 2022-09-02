import { ModuleWithProviders, NgModule } from '@angular/core';

import { MapsAPILoader, MAP_PROVIDER } from '@ng-maps/core';

import { GoogleMapsScriptLoader } from './google-maps-script-loader.service';
import { GoogleComponent } from './google.component';
import { GOOGLE_MAPS_API_CONFIG, GoogleModuleOptions } from './options';

@NgModule({
  declarations: [GoogleComponent],
  exports: [GoogleComponent],
  providers: [
    { provide: MapsAPILoader, useClass: GoogleMapsScriptLoader },
    {
      provide: MAP_PROVIDER,
      useValue: 'GoogleMaps',
    },
  ],
})
export class NgMapsGoogleModule {
  public static forRoot(
    config: GoogleModuleOptions,
  ): ModuleWithProviders<NgMapsGoogleModule> {
    return {
      ngModule: NgMapsGoogleModule,
      providers: [
        {
          provide: GOOGLE_MAPS_API_CONFIG,
          useValue: config,
        },
      ],
    };
  }

  public static forRootFactory(
    factory: () => GoogleModuleOptions | Promise<GoogleModuleOptions>,
  ): ModuleWithProviders<NgMapsGoogleModule> {
    return {
      ngModule: NgMapsGoogleModule,
      providers: [
        {
          provide: GOOGLE_MAPS_API_CONFIG,
          useFactory: factory,
        },
      ],
    };
  }
}
