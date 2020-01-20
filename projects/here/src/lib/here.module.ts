import { ModuleWithProviders, NgModule } from '@angular/core';
import { HereComponent } from './here.component';
import { MapsAPILoader, MAP_PROVIDER } from '@ng-maps/core';
import {
  HERE_MAPS_MODULE_OPTIONS,
  HereModuleOptions,
  optionsFactory,
} from './options';
import { HereMapsLoaderService } from './here-maps-loader.service';
import { MarkerClusterComponent } from './cluster/marker-cluster';

@NgModule({
  declarations: [HereComponent, MarkerClusterComponent],
  imports: [],
  exports: [HereComponent, MarkerClusterComponent],
})
export class NgMapsHereModule {
  static forRoot(
    options: HereModuleOptions,
  ): ModuleWithProviders<NgMapsHereModule> {
    return {
      ngModule: NgMapsHereModule,
      providers: [
        {
          provide: MapsAPILoader,
          useClass: HereMapsLoaderService,
        },
        {
          provide: HERE_MAPS_MODULE_OPTIONS,
          useFactory: optionsFactory(options),
        },
        {
          provide: MAP_PROVIDER,
          useValue: 'HereMaps',
        },
      ],
    };
  }
}
