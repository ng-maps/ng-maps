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
  /**
   * configure the NgMapsGoogleModule with a value
   * @param config
   */
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

  /**
   * configure the NgMapsGoogleModule with a factory
   * @param factory
   */
  public static forRootFactory(
    factory: (...args: Array<any>) => GoogleModuleOptions,
    deps?: Array<any>,
  ): ModuleWithProviders<NgMapsGoogleModule> {
    return {
      ngModule: NgMapsGoogleModule,
      providers: [
        {
          provide: GOOGLE_MAPS_API_CONFIG,
          useFactory: factory,
          deps,
        },
      ],
    };
  }
}
