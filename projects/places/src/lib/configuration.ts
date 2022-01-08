import { InjectionToken } from '@angular/core';

export interface NgMapsPlacesConfiguration {
  autocomplete?: Partial<google.maps.places.AutocompleteOptions>;
  searchBox?: google.maps.places.SearchBoxOptions;
}

export const NG_MAPS_PLACES_DEFAULT_CONFIGURATION = new InjectionToken<NgMapsPlacesConfiguration>(
  'NgMapsPlacesDefaultConfiguration',
);
