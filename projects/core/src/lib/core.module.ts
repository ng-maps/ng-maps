import { ModuleWithProviders, NgModule } from '@angular/core';
import { AgmFitBounds } from './directives/fit-bounds';
import { AgmInfoWindow } from './directives/info-window';
import { AgmMap } from './directives/map';
import { AgmMarker } from './directives/marker';
import { LazyMapsAPILoaderConfigLiteral, LAZY_MAPS_API_CONFIG } from './services/maps-api-loader/lazy-maps-api-loader-config';
import { LazyMapsAPILoader} from './services/maps-api-loader/lazy-maps-api-loader';
import { MapsAPILoader } from './services/maps-api-loader/maps-api-loader';
import { BROWSER_GLOBALS_PROVIDERS } from './utils/browser-globals';

/**
 * @internal
 */
export function coreDirectives() {
  return [
    AgmMap, AgmMarker, AgmInfoWindow, AgmFitBounds
  ];
}

/**
 * The angular-google-maps core module. Contains all Directives/Services/Pipes
 * of the core module. Please use `AgmCoreModule.forRoot()` in your app module.
 */
@NgModule({declarations: coreDirectives(), exports: coreDirectives()})
export class AgmCoreModule {
  /**
   * Please use this method when you register the module at the root level.
   */
  static forRoot(lazyMapsAPILoaderConfig?: LazyMapsAPILoaderConfigLiteral): ModuleWithProviders {
    return {
      ngModule: AgmCoreModule,
      providers: [
        ...BROWSER_GLOBALS_PROVIDERS, {provide: MapsAPILoader, useClass: LazyMapsAPILoader},
        {provide: LAZY_MAPS_API_CONFIG, useValue: lazyMapsAPILoaderConfig}
      ],
    };
  }
}
