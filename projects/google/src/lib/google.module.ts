import { ModuleWithProviders, NgModule } from '@angular/core';
import { GoogleComponent } from './google.component';
import { GoogleModuleOptions } from './options';
import { MAP_PROVIDER } from '../../../core/src/lib/core.module';

@NgModule({
  declarations: [GoogleComponent],
  imports: [],
  exports: [GoogleComponent],
})
export class NgMapsGoogleModule {
  static forRoot(
    loaderOptions?: GoogleModuleOptions,
  ): ModuleWithProviders<NgMapsGoogleModule> {
    return {
      ngModule: NgMapsGoogleModule,
      providers: [
        {
          provide: MAP_PROVIDER,
          useValue: 'GoogleMaps',
        },
      ],
    };
  }
}
