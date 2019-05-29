import { NgModule } from '@angular/core';
import { AgmAutocompleteDirective } from './directives/autocomplete';

/**
 * @internal
 */
export function placesDirectives() {
  return [
    AgmAutocompleteDirective
  ];
}

@NgModule({
  declarations: placesDirectives(),
  exports: placesDirectives()
})
export class PlacesModule { }
