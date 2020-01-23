import { ModuleWithProviders, NgModule } from '@angular/core';
import { MAP_PROVIDER, MapsAPILoader } from '@ng-maps/core';
import { MarkerClusterComponent } from './cluster/marker-cluster';
import { HereMapsLoaderService } from './here-maps-loader.service';
import { HereComponent } from './here.component';
import {
  HERE_MAPS_MODULE_OPTIONS,
  HereModuleOptions,
  optionsFactory,
} from './options';

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
