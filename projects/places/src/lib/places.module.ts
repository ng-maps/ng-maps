import { NgModule } from '@angular/core';
import { NgMapsAutocompleteDirective } from './directives/autocomplete';

/**
 * @internal
 */
export function placesDirectives() {
  return [
    NgMapsAutocompleteDirective
  ];
}

@NgModule({
  declarations: placesDirectives(),
  exports: placesDirectives()
})
export class NgMapsPlacesModule { }
