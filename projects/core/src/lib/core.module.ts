import { ModuleWithProviders, NgModule } from '@angular/core';
import { AgmFitBounds } from './directives/fit-bounds';
import { NgMapsInfoWindowComponent } from './directives/info-window';
import { NgMapsViewComponent } from './directives/map';
import { NgMapsMarkerComponent } from './directives/marker';
import { LazyMapsAPILoaderConfigLiteral, LAZY_MAPS_API_CONFIG } from './services/maps-api-loader/lazy-maps-api-loader-config';
import { LazyMapsAPILoader} from './services/maps-api-loader/lazy-maps-api-loader';
import { MapsAPILoader } from './services/maps-api-loader/maps-api-loader';

/**
 * @internal
 */
export function coreDirectives() {
  return [
    NgMapsViewComponent, NgMapsMarkerComponent, NgMapsInfoWindowComponent, AgmFitBounds
  ];
}

/**
 * The angular-google-maps core module. Contains all Directives/Services/Pipes
 * of the core module. Please use `NgMapsCoreModule.forRoot()` in your app module.
 */
@NgModule({declarations: coreDirectives(), exports: coreDirectives()})
export class NgMapsCoreModule {
  /**
   * Please use this method when you register the module at the root level.
   */
  static forRoot(lazyMapsAPILoaderConfig?: LazyMapsAPILoaderConfigLiteral): ModuleWithProviders {
    return {
      ngModule: NgMapsCoreModule,
      providers: [
        {provide: MapsAPILoader, useClass: LazyMapsAPILoader},
        {provide: LAZY_MAPS_API_CONFIG, useValue: lazyMapsAPILoaderConfig}
      ],
    };
  }
}
