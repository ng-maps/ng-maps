import { ModuleWithProviders, NgModule } from '@angular/core';

import {
  NgMapsPlacesConfiguration,
  NG_MAPS_PLACES_DEFAULT_CONFIGURATION,
} from './configuration';
import { NgMapsAutocompleteDirective } from './directives/autocomplete';
import { NgMapsSearchBoxDirective } from './directives/search-box';

/**
 * @internal
 */
export function placesDirectives() {
  return [NgMapsAutocompleteDirective, NgMapsSearchBoxDirective];
}

@NgModule({
  declarations: placesDirectives(),
  exports: placesDirectives(),
})
export class NgMapsPlacesModule {
  /**
   * configure the NgMapsPlacesModule with a value
   * @param config
   */
  public static forRoot(
    config: NgMapsPlacesConfiguration,
  ): ModuleWithProviders<NgMapsPlacesModule> {
    return {
      ngModule: NgMapsPlacesModule,
      providers: [
        {
          provide: NG_MAPS_PLACES_DEFAULT_CONFIGURATION,
          useValue: config,
        },
      ],
    };
  }

  /**
   * configure the NgMapsPlacesModule with a factory
   * @param factory
   * @param deps
   */
  public static forRootFactory(
    factory: (...args: Array<any>) => NgMapsPlacesConfiguration,
    deps?: Array<any>,
  ): ModuleWithProviders<NgMapsPlacesModule> {
    return {
      ngModule: NgMapsPlacesModule,
      providers: [
        {
          provide: NG_MAPS_PLACES_DEFAULT_CONFIGURATION,
          useFactory: factory,
          deps,
        },
      ],
    };
  }
}
