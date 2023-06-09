import { NgModule, ModuleWithProviders } from '@angular/core';

import { NgMapsDirectionDirective } from './directives/direction.directive';

@NgModule({
  declarations: [NgMapsDirectionDirective],
  exports: [NgMapsDirectionDirective],
})
export class NgMapsDirectionModule {
  public static forRoot(): ModuleWithProviders<NgMapsDirectionModule> {
    return {
      ngModule: NgMapsDirectionModule,
    };
  }
}
