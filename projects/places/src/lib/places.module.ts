import { ModuleWithProviders, NgModule } from '@angular/core';
import { NG_MAPS_PLACES_DEFAULT_CONFIGURATION } from './configuration';
import { NgMapsAutocompleteDirective } from './directives/autocomplete';

/**
 * @internal
 */
export function placesDirectives() {
  return [NgMapsAutocompleteDirective];
}

@NgModule({
  declarations: placesDirectives(),
  exports: placesDirectives(),
})
export class NgMapsPlacesModule {
  public static forRoot(
    config: Partial<google.maps.places.AutocompleteOptions>,
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
