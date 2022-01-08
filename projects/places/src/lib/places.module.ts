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
}
