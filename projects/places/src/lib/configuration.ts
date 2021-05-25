import { InjectionToken } from '@angular/core';

export const NG_MAPS_PLACES_DEFAULT_CONFIGURATION = new InjectionToken<
  Partial<google.maps.places.AutocompleteOptions>
>('NgMapsPlacesDefaultConfiguration');
