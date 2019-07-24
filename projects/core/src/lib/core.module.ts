import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgMapsFitBounds } from './directives/fit-bounds';
import { NgMapsInfoWindowComponent } from './directives/info-window';
import { NgMapsViewComponent } from './directives/map';
import { NgMapsMarkerComponent } from './directives/marker';
import { LazyMapsAPILoader } from './services/maps-api-loader/lazy-maps-api-loader';
import {
  LAZY_MAPS_API_CONFIG,
  LazyMapsAPILoaderConfigLiteral,
} from './services/maps-api-loader/lazy-maps-api-loader-config';
import { MapsAPILoader } from './services/maps-api-loader/maps-api-loader';

/**
 * @internal
 */
export function coreDirectives() {
  return [
    NgMapsViewComponent,
    NgMapsMarkerComponent,
    NgMapsInfoWindowComponent,
    NgMapsFitBounds,
  ];
}

/**
 * The angular-google-maps core module. Contains all Directives/Services/Pipes
 * of the core module. Please use `NgMapsCoreModule.forRoot()` in your app module.
 *
 * Provide configuration with values defined by {@link LazyMapsAPILoaderConfigLiteral}
 */
@NgModule({
  declarations: coreDirectives(),
  exports: coreDirectives(),
})
export class NgMapsCoreModule {
  /**
   * Please use this method when you register the module at the root level.
   */
  static forRoot(
    lazyMapsAPILoaderConfig?: LazyMapsAPILoaderConfigLiteral,
  ): ModuleWithProviders<NgMapsCoreModule> {
    return {
      ngModule: NgMapsCoreModule,
      providers: [
        { provide: MapsAPILoader, useClass: LazyMapsAPILoader },
        { provide: LAZY_MAPS_API_CONFIG, useValue: lazyMapsAPILoaderConfig },
      ],
    };
  }
}
